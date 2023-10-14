import { WalletSigner } from "_app/WalletSigner";
import type { BackgroundClient } from "_app/background-client";
import type { XDagAddress } from "_src/xdag/typescript/types";
import type { SerializedSignature } from "_src/xdag/typescript/cryptography";
import type { JsonRpcProvider } from "_src/xdag/typescript/rpc";

export class BackgroundServiceSigner extends WalletSigner
{
	readonly #address: XDagAddress;
	readonly #backgroundClient: BackgroundClient;

	constructor( address: XDagAddress, backgroundClient: BackgroundClient, provider: JsonRpcProvider, ) {
		super( provider );
		this.#address = address;
		this.#backgroundClient = backgroundClient;
	}

	async getAddress(): Promise<string> {
		return this.#address;
	}

	signData( data: Uint8Array ): Promise<SerializedSignature> {
		return this.#backgroundClient.signData( this.#address, data );
	}

	signDataByType( data: Uint8Array, signType: string ): Promise<SerializedSignature> {
		return this.#backgroundClient.signDataByType( this.#address, data, signType );
	}

	connect( provider: JsonRpcProvider ) {
		return new BackgroundServiceSigner( this.#address, this.#backgroundClient, provider, );
	}
}
