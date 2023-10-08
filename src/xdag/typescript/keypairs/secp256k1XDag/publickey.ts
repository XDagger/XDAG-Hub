import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import {
	SIGNATURE_SCHEME_TO_FLAG,
	PublicKey,
	PublicKeyInitData
} from "../../cryptography";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { sha256 } from "@noble/hashes/sha256";
import { toB58, fromB64, toHEX } from "_src/xdag/bcs";

const SECP256K1_PUBLIC_KEY_SIZE = 33;
export class Secp256k1PublicKey extends PublicKey
{
	static SIZE = SECP256K1_PUBLIC_KEY_SIZE;
	private data: Uint8Array;

	constructor( value: PublicKeyInitData ) {
		super();
		if ( typeof value === "string" ) {
			this.data = fromB64( value );
		} else if ( value instanceof Uint8Array ) {
			this.data = value;
		} else {
			this.data = Uint8Array.from( value );
		}
		if ( this.data.length !== SECP256K1_PUBLIC_KEY_SIZE ) {
			throw new Error( `Invalid public key input. Expected ${ SECP256K1_PUBLIC_KEY_SIZE } bytes, got ${ this.data.length }`, );
		}
	}

	override equals( publicKey: Secp256k1PublicKey ): boolean {
		return super.equals( publicKey );
	}

	toBytes(): Uint8Array {
		return this.data;
	}

	toXDagAddress(): string {
		const ripemd160Result = ripemd160( sha256( this.data ) );
		const checksum = sha256( sha256( ripemd160Result ) ).slice( 0, 4 );
		const hashedPubKey: Uint8Array = new Uint8Array( [ ...ripemd160Result, ...checksum ] );
		let xDagAddress = toB58( hashedPubKey );

		return xDagAddress;
	}

	flag(): number {
		return SIGNATURE_SCHEME_TO_FLAG[ "Secp256k1XDag" ];
	}
}



function  publicKeytoXDagAddress( pulicKey:Uint8Array): string {
	const ripemd160Result = ripemd160( sha256( pulicKey ) );
	const checksum = sha256( sha256( ripemd160Result ) ).slice( 0, 4 );
	const hashedPubKey: Uint8Array = new Uint8Array( [ ...ripemd160Result, ...checksum ] );
	let xDagAddress = toB58( hashedPubKey );
	return xDagAddress;
}
