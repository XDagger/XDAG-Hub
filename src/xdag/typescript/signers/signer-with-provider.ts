import { TransactionBlock } from "../builder/index";
import { IntentScope, messageWithIntent } from "../cryptography/intent";
import { fromB64, toB64 } from "_src/xdag/bcs";
import type { Signer } from "./signer";
import type { SignedTransaction, SignedMessage } from "./types";
import type { SerializedSignature } from "../cryptography/signature";
import type { JsonRpcProvider } from "../rpc/json-rpc-provider";
import type { XdagClient } from "../client/index";
import type { XDagAddress, XDagTransactionBlockResponse, } from "../types/index";

///////////////////////////////
// Exported Abstracts
export abstract class SignerWithProvider implements Signer
{

	readonly client: JsonRpcProvider | XdagClient;
	constructor( client: JsonRpcProvider | XdagClient ) {
		this.client = client;
	}


	// Returns the checksum address
	abstract getAddress(): Promise<XDagAddress>;

	abstract signData( data: Uint8Array ): Promise<SerializedSignature>;

	abstract signDataByType( data: Uint8Array, signType: string ): Promise<SerializedSignature>;

	// Returns a new instance of the Signer, connected to provider.
	// This MAY throw if changing providers is not supported.
	abstract connect( client: XdagClient | JsonRpcProvider ): SignerWithProvider;

	/**
	 * Sign a message using the keypair, with the `PersonalMessage` intent.
	 */
	async signMessage( input: { message: Uint8Array } ): Promise<SignedMessage> {
		const signature = await this.signData(
			messageWithIntent( IntentScope.PersonalMessage, input.message ),
		);

		return {
			messageBytes: toB64( input.message ),
			signature,
		};
	}

	// If the sender has not yet been set on the transaction, then set it.
	// NOTE: This allows for signing transactions with mis-matched senders, which is important for sponsored transactions.
	protected async prepareTransactionBlock( transactionBlock: Uint8Array | TransactionBlock, ) {
		if ( TransactionBlock.is( transactionBlock ) ) {
			transactionBlock.setSenderIfNotSet( await this.getAddress() );
			return await transactionBlock.build( { client: this.client, } );
		}
		if ( transactionBlock instanceof Uint8Array ) {
			return transactionBlock;
		}
		throw new Error( "Unknown transaction format" );
	}

	/**
	 * Sign a transaction.
	 */
	async signTransactionBlock( input: { transactionBlock: Uint8Array | TransactionBlock; } ): Promise<SignedTransaction> {
		const transactionBlockBytes = await this.prepareTransactionBlock( input.transactionBlock, );
		// const intentMessage = messageWithIntent( IntentScope.TransactionData, transactionBlockBytes, );
		//will sign with BackgroundServiceSigner which will call backgroud service to signe it .
		const signature = await this.signData( transactionBlockBytes );
		return {
			transactionBlockBytes: toB64( transactionBlockBytes ),
			signature,
		};
	}

	async signTransactionBlockByType( transactionBlock: Uint8Array | TransactionBlock, transactionType: string ): Promise<SignedTransaction> {
		const transactionBlockBytes = await this.prepareTransactionBlock( transactionBlock );
		//will sign with BackgroundServiceSigner which will call backgroud service to signe it .
		const signature = await this.signDataByType( transactionBlockBytes, transactionType );
		return {
			transactionBlockBytes: toB64( transactionBlockBytes ),
			signature,
		};
	}

	async signAndExecuteTransactionBlockByType( transactionBlock: Uint8Array | TransactionBlock, transactionType: string )
		: Promise<XDagTransactionBlockResponse> {
		const { transactionBlockBytes, signature } = await this.signTransactionBlockByType( transactionBlock, transactionType );
		//now it will turn to src/xdag/typescript/rpc/json-rpc-provider.ts
		return await this.client.executeSendRawTransaction( transactionBlockBytes, signature, transactionType );
	}



}
