import { XDagHTTPTransport } from "./http-transport.js";
import { isValidXDagAddress, normalizeXDagAddress, } from "../types/index.js";
import type { XDagTransport } from "./http-transport.js";
import type {
	XDagAddress,
	XDagTransactionBlockResponse,
	PaginatedCoins,
	CoinBalance,
	CoinSupply,
} from "../types/index.js";
import type { CoinMetadata } from "_src/xdag/typescript/framework";

export * from "./http-transport.js";

export interface PaginationArguments<Cursor>
{
	/** Optional paging cursor */
	cursor?: Cursor;
	/** Maximum item returned per page */
	limit?: number | null;
}


/**
 * Configuration options for the XdagClient
 * You must provide either a `url` or a `transport`
 */
export type XdagClientOptions = NetworkOrTransport;

export type NetworkOrTransport =
	| {
	url: string;
	transport?: never;
}
	| {
	transport: XDagTransport;
	url?: never;
};

export class XdagClient
{
	protected transport: XDagTransport;

	/**
	 * Establish a connection to a Xdag RPC endpoint
	 *
	 * @param options configuration options for the API Client
	 */
	constructor( options: XdagClientOptions ) {
		this.transport = options.transport ?? new XDagHTTPTransport( { url: options.url } );
	}

	async getRpcApiVersion(): Promise<string | undefined> {
		const resp = await this.transport.request<{ info: { version: string } }>( {
			method: "rpc.discover",
			params: [],
		} );

		return resp.info.version;
	}

	/**
	 * Get all Coin<`coin_type`> objects owned by an address.
	 */
	async getCoins(
		input: {
			owner: XDagAddress;
			coinType?: string | null;
		} & PaginationArguments<PaginatedCoins["nextCursor"]>,
	): Promise<PaginatedCoins> {
		throw new Error( " should not use this getCoins function." );
		// return await this.transport.request( {
		// 	method: "Xdagx_getCoins",
		// 	params: [ input.owner, input.coinType, input.cursor, input.limit ],
		// } );
	}


	/**
	 * Get the total coin balance for one coin type, owned by the address owner.
	 */
	async getBalance( input: {
		owner: XDagAddress;
		/** optional fully qualified type names for the coin (e.g., 0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC), default to 0x2::Xdag::XDAG if not specified. */
		coinType?: string | null;
	} ): Promise<CoinBalance> {
		if (
			!input.owner ||
			!isValidXDagAddress( normalizeXDagAddress( input.owner ) )
		) {
			throw new Error( "Invalid Xdag address" );
		}
		return await this.transport.request( {
			method: "Xdagx_getBalance",
			params: [ input.owner, input.coinType ],
		} );
	}

	/**
	 * Get the total coin balance for all coin types, owned by the address owner.
	 */
	async getAllBalances( input: { owner: XDagAddress } ): Promise<CoinBalance[]> {
		if (
			!input.owner ||
			!isValidXDagAddress( normalizeXDagAddress( input.owner ) )
		) {
			throw new Error( "Invalid Xdag address" );
		}
		return await this.transport.request( {
			method: "Xdagx_getAllBalances",
			params: [ input.owner ],
		} );
	}

	/**
	 * Fetch CoinMetadata for a given coin type
	 */
	async getCoinMetadata( input: {
		coinType: string;
	} ): Promise<CoinMetadata | null> {
		return await this.transport.request( {
			method: "Xdagx_getCoinMetadata",
			params: [ input.coinType ],
		} );
	}

	/**
	 *  Fetch total supply for a coin
	 */
	async getTotalSupply( input: { coinType: string } ): Promise<CoinSupply> {
		return await this.transport.request( {
			method: "Xdagx_getTotalSupply",
			params: [ input.coinType ],
		} );
	}

	/**
	 * Invoke any RPC method
	 * @param method the method to be invoked
	 * @param args the arguments to be passed to the RPC request
	 */
	async call<T = unknown>( method: string, params: unknown[] ): Promise<T> {
		return await this.transport.request( { method, params } );
	}



	async queryTransactionBlocks(
		input: any,
	): Promise<any> {
		throw new Error("can' do : queryTransactionBlocks")
	}


	async getTransactionBlock( input: { digest: string } ): Promise<XDagTransactionBlockResponse> {
		const postBody = {
			jsonrpc: "2.0",
			method: "xdag_getBlockByHash",
			params: [ input.digest, 1 ],
			id: 1,
		};
		return {
			address: "",
			hash: "",
			state: "Main",
			errorInfo: " can't use this function ins websocket."
		}
	}

	async executeSendRawTransaction( transactionBlock: Uint8Array | string, signature: string, transactionType: string )
		: Promise<XDagTransactionBlockResponse> {
		return {
			address:"",
			hash:"",
			state:"error",
			errorInfo: " can't use this function ins websocket.",
		}
	}





}
