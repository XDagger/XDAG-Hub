import { requestXdagFromFaucetV0 } from "../faucet";
import { JsonRpcClient } from "./client";
import { devnetConnection, mainnetConnection } from "./connection";
import { DEFAULT_CLIENT_OPTIONS, WebsocketClient } from "./websocket-client";
import {
	XDagAddress,
	PaginatedCoins,
	CoinBalance,
	CoinStruct, XDagAddressBlockResponse, normalizeXDagAddress, isValidXDagAddress, XDagTransactionBlockResponse,
} from "../types";
import type { HttpHeaders } from "./client.js";
import type { Connection } from "./connection.js";
import type { WebsocketClientOptions } from "./websocket-client.js";
import { ClientAxios } from "_src/xdag/typescript/rpc/ClientAxios";
import Browser from "webextension-polyfill";
import { CoinMetadata } from "_src/xdag/typescript/framework";

export type RpcProviderOptions = {
	/**
	 * Configuration options for the websocket connection
	 * TODO: Move to connection.
	 */
	socketOptions?: WebsocketClientOptions;
	/**
	 * Cache timeout in seconds for the RPC API Version
	 */
	versionCacheTimeoutInSeconds?: number;

	/** Allow defining a custom RPC client to use */
	rpcClient?: JsonRpcClient;

	/** Allow defining a custom websocket client to use */
	websocketClient?: WebsocketClient;
};

const DEFAULT_OPTIONS: RpcProviderOptions = {
	socketOptions: DEFAULT_CLIENT_OPTIONS,
	versionCacheTimeoutInSeconds: 600,
};

export class JsonRpcProvider
{
	public connection: Connection;
	protected client: JsonRpcClient;
	protected wsClient: WebsocketClient;
	protected axiosClient: ClientAxios;

	constructor( connection: Connection = mainnetConnection, public options: RpcProviderOptions = DEFAULT_OPTIONS, ) {
		this.connection = connection;
		const opts = { ...DEFAULT_OPTIONS, ...options };
		this.options = opts;
		this.client = opts.rpcClient ?? new JsonRpcClient( this.connection.fullnode );
		this.wsClient = opts.websocketClient ?? new WebsocketClient( this.connection.websocket, opts.socketOptions );
		this.axiosClient = new ClientAxios( this.connection.fullnode )
	}


	/** @deprecated Use `/Xdag.js/faucet` instead. */
	async requestXDagFromFaucet( recipient: XDagAddress, headers?: HttpHeaders ) {
		if ( !this.connection.faucet ) {
			throw new Error( "Faucet URL is not specified" );
		}
		return requestXdagFromFaucetV0( {
			host: this.connection.faucet,
			recipient,
			headers,
		} );
	}

	async getCoins( input: { owner: XDagAddress; coinType?: string | null; } ): Promise<PaginatedCoins> {
		let address = normalizeXDagAddress( input.owner );
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBalance",
			params: [ address ],
			id: 1,
		};
		const data = await this.axiosClient.request( postBody );

		const coinSt: CoinStruct = {
			coinType: "XDag",
			coinObjectId: "",
			version: "",
			digest: "",
			balance: data?.result ?? "0",
			previousTransaction: "",
		}
		const result: PaginatedCoins = {
			data: [ coinSt ],
			nextCursor: null,
			hasNextPage: false,
		}
		return result;
	}

	async getBalance( input: { owner: XDagAddress; coinType?: string | null; } ): Promise<CoinBalance> {
		let address = normalizeXDagAddress( input.owner );
		if ( !input.owner || !isValidXDagAddress( address ) ) {
			console.error( 'getBalance invalid address:', address )
			throw new Error( "error: ####Invalid Xdag address###" );
		}
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBalance",
			params: [ address ],
			id: 1,
		};
		const data = await this.axiosClient.request( postBody );
		const cBalance: CoinBalance = {
			coinType: "XDag",
			coinObjectCount: 0,
			totalBalance: data?.result ?? "0",
			lockedBalance: {}
		}
		return cBalance;
	}

	async getAllBalances( input: { owner: XDagAddress } ): Promise<CoinBalance[]> {
		if ( !input.owner || !isValidXDagAddress( normalizeXDagAddress( input.owner ) ) ) {
			throw new Error( "Invalid Xdag address" );
		}
		let address = normalizeXDagAddress( input.owner );
		if ( !input.owner || !isValidXDagAddress( address ) ) {
			console.error( 'getBalance invalid address:', address )
			throw new Error( "error: ####Invalid Xdag address###" );
		}
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBalance",
			params: [ address ],
			id: 1,
		};
		const data = await this.axiosClient.request( postBody );

		const cBalance: CoinBalance = {
			coinType: "XDag",
			coinObjectCount: 0,
			totalBalance: data?.result ?? "0",
			lockedBalance: {}
		}
		return [ cBalance ];
	}


	/**
	 * Fetch CoinMetadata for a given coin type
	 */
	async getCoinMetadata( input: {
		coinType: string;
	} ): Promise<CoinMetadata | null> {
		// return await this.client.requestWithType(
		// 	"Xdagx_getCoinMetadata",
		// 	[ input.coinType ],
		// 	CoinMetadataStruct,
		// );
		return null;
	}


	/**
	 * Invoke any RPC method
	 * @param method the method to be invoked
	 * @param args the arguments to be passed to the RPC request
	 */
	async call( method: string, params: any[] ): Promise<any> {
		return await this.client.request( method, params );
	}




// error response
// {
// 	"jsonrpc": "2.0",
// 	"id": 1,
// 	"error": {
// 		"code": -32603,
// 		"message": "Internal server error"
// 	}
// }
// correct response
// 	"jsonrpc": "2.0",
// 	"id": 1,
// 	"result": {
// 		"height": 0,
// 		"balance": "168.000000000",
// 		"blockTime": 1693224448000,
// 		"timeStamp": 1733861834752,
// 		"state": "Accepted",
// 		"hash": null,
// 		"address": "C3vw9K8wteBHkaFTEiezh825YQrYWz71k",
// 		"remark": null,
// 		"diff": null,
// 		"type": "Wallet",
// 		"flags": null,
// 		"totalPage": 1,
// 		"refs": null,
// 		"transactions": [
// 			{
// 				"direction": 0,
// 				"hashlow": "0000000000000000e89a5f1857d1ea7065ce35197a9296dd3ffe1230fa3d03c3",
// 				"address": "wwM9+jAS/j/dlpJ6GTXOZXDq0VcYX5ro",
// 				"amount": "1.000000000",
// 				"time": 1694090442805,
// 				"remark": "wwwfvfvf"
// 			},
// 			...string
// 			]
	//query address block
	async queryAddressBlock( input: { XDagAddress: string } ): Promise<XDagAddressBlockResponse> {
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBlockByHash",
			params: [ input.XDagAddress, 1 ],
			id: 1,
		};
		const data = await this.axiosClient.request( postBody );
		const result = data?.result;
		if ( result?.address && result?.balance ) {
			return result;
		}
		return {
			address: "",
			balance: "0",
		}
	}

	async getTransactionBlock( input: { digest: string } ): Promise<XDagTransactionBlockResponse> {
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBlockByHash",
			params: [ input.digest, 1 ],
			id: 1,
		};
		const data = await this.axiosClient.request( postBody );
		const response = data?.result;

		if ( response?.address && response?.hash ) {
			if ( response.state === 'Pending' ) {
				await Browser.storage.local.set( { pendingBlockAddress: response.address } )
				//we can't do store dispatch,for the first time was called, the evn isn't initailized ,but i dontknow how to judge initial is done
				// store.dispatch( setPendingTransactionBlock( { blockAddress: response.adress } ) );
			} else {
				const pendObj =await Browser.storage.local.get( { "pendingBlockAddress": null } )
				if ( pendObj.pendingBlockAddress === response?.address ) {
					await Browser.storage.local.set( { pendingBlockAddress: null } )
				}
			}
			return response
		}
		return {
			address: "",
			hash: "",
			state: "error",
			errorInfo: "error get transaction block.",
		}
	}

	async #sleep( ms: number ): Promise<void> {
		return new Promise( resolve => setTimeout( resolve, ms ) );
	}

	//return from sever: {jsonrpc: '2.0', id: 1, result: 'uGF51DSyz6UJY7hAx1pY/QR9c632S6a2'}
	async executeSendRawTransaction( transactionBlock: Uint8Array | string, signature: string, transactionType: string ): Promise<XDagTransactionBlockResponse> {
		if ( transactionType === "transfer" ) {
			const postBody = {
				jsonrpc: "2.0",
				method: "xdag_sendRawTransaction",
				params: [ signature ],
				id: 1,
			};
			const data = await this.axiosClient.request( postBody );
			if ( data?.result ) {
				const transactionBlockAddress = data.result;
				for ( let i = 0; i <= 8; i++ ) {
					const tranBlock = await this.getTransactionBlock( { digest: transactionBlockAddress } );
					if ( tranBlock.errorInfo ) {
						await this.#sleep( 2000 );
					} else {
						return tranBlock;
					}
				}
			}
		}
		return {
			address: "",
			hash: "",
			state: "error",
			errorInfo: "error in transfer coins",
		}
	}


}
