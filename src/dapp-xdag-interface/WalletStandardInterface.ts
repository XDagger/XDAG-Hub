import {
	type StandardEventsListeners,
	type Wallet,
	ReadonlyWalletAccount,
	StandardEventsFeature,
	StandardConnectFeature,
	type StandardEventsOnMethod,
	type StandardConnectMethod,
} from "@wallet-standard/core";
import mitt, { type Emitter } from "mitt";
import { filter, map, type Observable } from "rxjs";
import { mapToPromise } from "./utils";
import { createMessage } from "_messages";
import { WindowMessageStream } from "_messaging/WindowMessageStream";
import {
	type AcquirePermissionsRequest,
	type AcquirePermissionsResponse,
	type HasPermissionsRequest,
	type HasPermissionsResponse,
	ALL_PERMISSION_TYPES,
} from "_payloads/permissions";
import { API_ENV } from "_src/shared/api-env";
import { type SignMessageRequest } from "_src/shared/messaging/messages/payloads/transactions/SignMessage";
import { isWalletStatusChangePayload } from "_src/shared/messaging/messages/payloads/wallet-status-change";
import { toB64, fromB64 } from "_src/xdag/bcs";
import { TransactionBlock } from "_src/xdag/typescript/builder";
import {
	XDAG_LOCALNET_CHAIN,
	XDAG_DEVNET_CHAIN,
	XDAG_TESTNET_CHAIN,
	XDAG_MAINNET_CHAIN,
	XDAG_CHAINS,
} from "_src/xdag/features";
import { type XdagSignMessageMethod } from "_src/xdag/supplement/XdagSignMessageInput";
import { type XdagSignTransactionBlockMethod } from "_src/xdag/supplement/XdagSignTransactionBlock";
import type { BasePayload, Payload } from "_payloads";
import type { GetAccount } from "_payloads/account/GetAccount";
import type { GetAccountResponse } from "_payloads/account/GetAccountResponse";
import type { SetNetworkPayload } from "_payloads/network";
import type {
	StakeRequest,
	SignTransactionRequest,
	SignTransactionResponse,
} from "_payloads/transactions";
import type { NetworkEnvType } from "_src/background/NetworkEnv";

type WalletEventsMap = { [E in keyof StandardEventsListeners]: Parameters<StandardEventsListeners[E]>[0]; };

// NOTE: Because this runs in a content script, we can't fetch the manifest.
const name = process.env.APP_NAME || "XDag Hub";

type StakeInput = { validatorAddress: string };
type ChainType = Wallet["chains"][number];
const API_ENV_TO_CHAIN: Record<Exclude<API_ENV, API_ENV.customRPC>, ChainType> = {
	[ API_ENV.local ]: XDAG_LOCALNET_CHAIN,
	[ API_ENV.devNet ]: XDAG_DEVNET_CHAIN,
	[ API_ENV.testNet ]: XDAG_TESTNET_CHAIN,
	[ API_ENV.mainnet ]: XDAG_MAINNET_CHAIN,
};

export class XDagWallet implements Wallet
{
	readonly #events: Emitter<WalletEventsMap>;
	readonly #version = "1.0.0" as const;
	readonly #name = name;
	#accounts: ReadonlyWalletAccount[];
	#messagesStream: WindowMessageStream;
	#activeChain: ChainType | null = null;

	get version() {
		return this.#version;
	}

	get name() {
		return this.#name;
	}

	get icon() {
		return "data:image/svg+xml;base64,...+" as const;
	}

	get chains() {
		return XDAG_CHAINS;
	}

	get features() {
		return {
			"standard:connect": { version: "1.0.0", connect: this.#connect, },
			"standard:events": { version: "1.0.0", on: this.#on, },
			"XDag:signTransactionBlock": { version: "1.0.0", signTransactionBlock: this.#signTransactionBlock, },
			"XDag:signAndExecuteTransactionBlock": { version: "1.0.0", signAndExecuteTransactionBlock: this.#signAndExecuteTransactionBlock, },
			"XDag:signMessage": { version: "1.0.0", signMessage: this.#signMessage, },
		};
	}

	get accounts() {
		return this.#accounts;
	}

	#setAccounts( accounts: GetAccountResponse["accounts"] ) {
		this.#accounts = accounts.map(
			( { address, publicKey } ) => new ReadonlyWalletAccount( {
				address,
				publicKey: publicKey ? fromB64( publicKey ) : new Uint8Array(),
				chains: this.#activeChain ? [ this.#activeChain ] : [],
				features: [ "XDag:signAndExecuteTransaction" ],
			} ),
		);
	}

	constructor() {
		this.#events = mitt();
		this.#accounts = [];
		this.#messagesStream = new WindowMessageStream( "Xdag_in-page", "Xdag_content-script", );
		this.#messagesStream.messages.subscribe( ( { payload } ) => {
			if ( isWalletStatusChangePayload( payload ) ) {
				const { network, accounts } = payload;
				if ( network ) {
					this.#setActiveChain( network );
					if ( !accounts ) {
						// in case an accounts change exists skip updating chains of current accounts
						// accounts will be updated in the if block below
						this.#accounts = this.#accounts.map(
							( { address, features, icon, label, publicKey } ) =>
								new ReadonlyWalletAccount( {
									address,
									publicKey,
									chains: this.#activeChain ? [ this.#activeChain ] : [],
									features,
									label,
									icon,
								} ),
						);
					}
				}
				if ( accounts ) {
					this.#setAccounts( accounts );
				}
				this.#events.emit( "change", { accounts: this.accounts } );
			}
		} );
	}

	#on: StandardEventsOnMethod = ( event, listener ) => {
		this.#events.on( event, listener );
		return () => this.#events.off( event, listener );
	};

	#connected = async () => {
		this.#setActiveChain( await this.#getActiveNetwork() );
		if ( !(await this.#hasPermissions( [ "viewAccount" ] )) ) {
			return;
		}
		const accounts = await this.#getAccounts();
		this.#setAccounts( accounts );
		if ( this.#accounts.length ) {
			this.#events.emit( "change", { accounts: this.accounts } );
		}
	};

	#connect: StandardConnectMethod = async ( input ) => {
		if ( !input?.silent ) {
			await mapToPromise(
				this.#send<AcquirePermissionsRequest, AcquirePermissionsResponse>( {
					type: "acquire-permissions-request",
					permissions: ALL_PERMISSION_TYPES,
				} ),
				( response ) => response.result,
			);
		}

		await this.#connected();
		return { accounts: this.accounts };
	};

	#signTransactionBlock: XdagSignTransactionBlockMethod = async ( input: any, ) => {
		if ( !TransactionBlock.is( input.transactionBlock ) ) {
			throw new Error( "Unexpect transaction format found. Ensure that you are using the `Transaction` class.", );
		}
		return mapToPromise(
			this.#send<SignTransactionRequest, SignTransactionResponse>( {
				type: "sign-transaction-request",
				transaction: {
					...input,
					// account might be undefined if previous version of adapters is used
					// in that case use the first account address
					account: input.account?.address || this.#accounts[ 0 ]?.address || "",
					transaction: input.transactionBlock.serialize(),
				},
			} ),
			( response ) => response.result,
		);
	};

	// #signAndExecuteTransactionBlock: XdagSignAndExecuteTransactionBlockMethod =
	#signAndExecuteTransactionBlock = async ( input: { toAddress: string, amount: number, remark: string } ) => {
		if ( !input.toAddress && input.toAddress.length < 5 ) {
			throw new Error( "invalid parameter when call signAndExecuteTransactionBlock " );
		}
		return mapToPromise(
			this.#send( {
				type: "execute-transaction-request",
				transaction: {
					type: "transaction",
					remark:input.remark,
					amount: input.amount,
					account: input.toAddress,
					toAddress:input.toAddress
				},
			} ),
			( response ) => (response as any)?.result,
		);
	};


	#stake = async ( input: StakeInput ) => {
		this.#send<StakeRequest, void>( { type: "stake-request", validatorAddress: input.validatorAddress, } );
	};

	#signMessage: XdagSignMessageMethod = async ( { message, account } ) => {
		return mapToPromise(
			this.#send<SignMessageRequest, SignMessageRequest>( {
				type: "sign-message-request",
				args: {
					message: toB64( message ),
					accountAddress: account.address,
				},
			} ),
			( response ) => {
				if ( !response.return ) {
					throw new Error( "Invalid sign message response" );
				}
				return response.return;
			},
		);
	};

	#hasPermissions( permissions: HasPermissionsRequest["permissions"] ) {
		return mapToPromise(
			this.#send<HasPermissionsRequest, HasPermissionsResponse>( {
				type: "has-permissions-request",
				permissions: permissions,
			} ),
			( { result } ) => result,
		);
	}

	#getAccounts() {
		return mapToPromise(
			this.#send<GetAccount, GetAccountResponse>( { type: "get-account", } ),
			( response ) => response.accounts,
		);
	}

	#getActiveNetwork() {
		return mapToPromise(
			this.#send<BasePayload, SetNetworkPayload>( {
				type: "get-network",
			} ),
			( { network } ) => network,
		);
	}

	#setActiveChain( { env }: NetworkEnvType ) {
		this.#activeChain = env === API_ENV.customRPC ? "xdag:unknown" : API_ENV_TO_CHAIN[ env ];
	}

	#send<RequestPayload extends Payload, ResponsePayload extends Payload | void = void, >( payload: RequestPayload, responseForID?: string, )
		: Observable<ResponsePayload> {
		const msg = createMessage( payload, responseForID );
		this.#messagesStream.send( msg );
		return this.#messagesStream.messages.pipe(
			filter( ( { id } ) => id === msg.id ),
			map( ( msg ) => msg.payload as ResponsePayload ),
		);
	}
}
