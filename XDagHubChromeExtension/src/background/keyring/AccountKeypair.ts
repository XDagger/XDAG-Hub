import { blake2b } from "@noble/hashes/blake2b";
import { toSerializedSignature } from "_src/xdag/typescript/cryptography";
import type { SerializedSignature, Keypair } from "_src/xdag/typescript/cryptography";
import { fromB64, toB64 } from "_src/xdag/bcs";

export class AccountKeypair
{

	#keypair: Keypair;

	constructor( keypair: Keypair ) {
		this.#keypair = keypair;
	}

	async sign( data: Uint8Array ): Promise<SerializedSignature> {
		const digest = blake2b( data, { dkLen: 32 } );
		const pubkey = this.#keypair.getPublicKey();
		const signature = this.#keypair.signData( digest );
		const signatureScheme = this.#keypair.getKeyScheme();
		return toSerializedSignature( {
			signature,
			signatureScheme,
			pubKey: pubkey,
		} );
	}

	async signByType( data: Uint8Array, signType: string ): Promise<string> {
		const pubkey = this.#keypair.getPublicKey();
		const signature = this.#keypair.signDataByType( data, signType );
		const signatureScheme = this.#keypair.getKeyScheme();
		return signature.toString();
		// return toSerializedSignature( {
		// 	signature,
		// 	signatureScheme,
		// 	pubKey: pubkey,
		// } );
	}

	exportKeypair() {
		return this.#keypair.export();
	}

	get publicKey() {
		return this.#keypair.getPublicKey();
	}
}
