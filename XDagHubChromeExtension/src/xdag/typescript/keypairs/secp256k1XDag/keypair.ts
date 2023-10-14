


import { secp256k1 } from "@noble/curves/secp256k1";
import { blake2b } from "@noble/hashes/blake2b";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { HDKey } from "@scure/bip32";
import { Secp256k1PublicKey } from "./publickey.js";
import { Keypair } from "../../cryptography/keypair.js";
import { mnemonicToSeed, } from "../../cryptography/mnemonics.js";
import { fromHEX, toB64, toHEX } from "_src/xdag/bcs";
import type { ExportedKeypair } from "../../cryptography/keypair.js";
import type { PublicKey } from "../../cryptography/publickey.js";
import type { SignatureScheme } from "../../cryptography/signature.js";
import { boolean, number, string } from "superstruct";
import { Buffer } from "buffer";
import { checkBase58Address, getCurrentTimestamp, xDag2Amount } from "_src/xdag/typescript/keypairs/secp256k1XDag/XDagSignHelper";
import BigNumber from "bignumber.js";

export const DEFAULT_SECP256K1_DERIVATION_PATH = "m/44'/586'/0'/0/0";


export interface Secp256k1KeypairData
{
	publicKey: Uint8Array;
	secretKey: Uint8Array;
}


export class Secp256k1Keypair extends Keypair
{
	private keypair: Secp256k1KeypairData;


	constructor( keypair?: Secp256k1KeypairData ) {
		super();
		if ( keypair ) {
			this.keypair = keypair;
		} else {
			const secretKey: Uint8Array = secp256k1.utils.randomPrivateKey();
			const publicKey: Uint8Array = secp256k1.getPublicKey( secretKey, true );
			this.keypair = { publicKey, secretKey };
		}
	}


	getKeyScheme(): SignatureScheme {
		return "Secp256k1XDag";
	}


	static generate(): Secp256k1Keypair {
		return new Secp256k1Keypair();
	}

	static fromSecretKey( secretKey: Uint8Array, options?: { skipValidation?: boolean }, ): Secp256k1Keypair {
		const publicKey: Uint8Array = secp256k1.getPublicKey( secretKey, true );
		if ( !options || !options.skipValidation ) {
			const encoder = new TextEncoder();
			const signData = encoder.encode( "Xdag validation" );
			const msgHash = bytesToHex( blake2b( signData, { dkLen: 32 } ) );
			const signature = secp256k1.sign( msgHash, secretKey );
			if ( !secp256k1.verify( signature, msgHash, publicKey, { lowS: true } ) ) {
				throw new Error( "Provided secretKey is invalid" );
			}
		}
		return new Secp256k1Keypair( { publicKey, secretKey } );
	}


	//seed is private key
	static fromSeed( seed: Uint8Array ): Secp256k1Keypair {
		let publicKey = secp256k1.getPublicKey( seed, true );
		return new Secp256k1Keypair( { publicKey, secretKey: seed } );
	}


	getPublicKey(): PublicKey {
		return new Secp256k1PublicKey( this.keypair.publicKey );
	}


	async sign( data: Uint8Array ) {
		return this.signData( data );
	}

	signData( data: Uint8Array ): Uint8Array {
		const msgHash = sha256( data );
		const sig = secp256k1.sign( msgHash, this.keypair.secretKey, { lowS: true, } );
		return sig.toCompactRawBytes();
	}

	signDataByType( data: Uint8Array, signType: string ): Uint8Array {
		if ( signType === "transfer" )
			return this.#signXDagTransferData( data );

		return new Uint8Array( 0 );
	}

	static deriveKeypair( mnemonics: string, path?: string ): Secp256k1Keypair {
		const key = HDKey.fromMasterSeed( mnemonicToSeed( mnemonics ) ).derive( path ?? DEFAULT_SECP256K1_DERIVATION_PATH );
		if ( key.publicKey == null || key.privateKey == null ) {
			throw new Error( "Invalid key" );
		}
		return new Secp256k1Keypair( {
			publicKey: key.publicKey,
			secretKey: key.privateKey,
		} );
	}


	export(): ExportedKeypair {
		return {
			schema: "Secp256k1",
			privateKey: toB64( this.keypair.secretKey ),
		};
	}


	#signXDagTransferData( baseInfoData: Uint8Array ): Uint8Array {

		const decoder = new TextDecoder();
		const decodedString = decoder.decode( baseInfoData );
		const baseInfo = JSON.parse( decodedString );

		// [ { "to": "EjfvPZnq5PJWEtXPkgQ4RETaZsSHPWexA", "from": "QCe7mZrnqDUVhvN4CGcRV2drB3gJm3TtH", "amount": 2, "remark": "qqqqq" } ]
		let one = baseInfo[ 0 ];
		if ( !one ) {
			throw new Error( 'invalid sign data' )
		}
		let fromAddr = one.from;
		let toAddr = one.to
		let amount = one.amount;
		let remark = one.remark ?? '' as string;
		remark.trim();

		//from
		let from = checkBase58Address( fromAddr );

		//to
		let to = checkBase58Address( toAddr );

		//remark
		const remarkBytes: Uint8Array = new Uint8Array( 32 );
		if ( remark !== '' ) {
			const encoder = new TextEncoder();
			let remarkBytesList = encoder.encode( remark );
			if ( remarkBytesList.length > 32 ) {
				remarkBytesList = remarkBytesList.slice( 0, 32 );
			}
			remarkBytes.set( remarkBytesList );
		}

		//amount
		const transVal: bigint = xDag2Amount( BigNumber(amount).toNumber() );
		const valBytes: Uint8Array = new Uint8Array( 8 );
		new DataView( valBytes.buffer ).setBigUint64( 0, transVal, true );

		//time
		const t: bigint = getCurrentTimestamp();
		const timeBytes: Uint8Array = new Uint8Array( 8 );
		new DataView( timeBytes.buffer ).setBigUint64( 0, t, true );

		//publicKey property
		// bool isPubKeyEven = wallet.publicKey[0] % 2 == 0;
		let isPubKeyEven: boolean = this.getPublicKey().toBytes()[ 0 ] % 2 === 0

		//============================
		//prepare data buffer now
		let sb: string = '0000000000000000C1';
		if ( remark !== '' ) {
			sb += isPubKeyEven ? '9D560500000000' : '9D570500000000'
		} else {
			sb += isPubKeyEven ? '6D550000000000' : '7D550000000000'
		}

		sb += toHEX( Buffer.from( timeBytes ) );
		sb += '0000000000000000';
		sb += from;
		sb += toHEX( Buffer.from( valBytes ) );
		sb += to;
		sb += toHEX( Buffer.from( valBytes ) );

		if ( remark !== '' ) {
			sb += toHEX( Buffer.from( remarkBytes ) );
		}

		sb += toHEX(this.getPublicKey().toBytes().slice(1));
		let res = this.#innerSign( sb, remark );
		sb += res[ 'r' ]!;
		sb += res[ 's' ]!;

		if ( remark !== "" ) {
			for ( var i = 0; i < 18; i++ ) {
				sb += "00000000000000000000000000000000";
			}
		} else {
			for ( var i = 0; i < 20; i++ ) {
				sb += "00000000000000000000000000000000";
			}
		}

		return Buffer.from(sb);
	}

	#innerSign( sb: string, remark: string ) : Record<string, string>{
		if ( remark.length > 0 ) {
			for ( let i = 0; i < 22; i++ ) {
				sb += "00000000000000000000000000000000";
			}
		} else {
			for ( let i = 0; i < 24; i++ ) {
				sb += "00000000000000000000000000000000";
			}
		}

		sb += toHEX( this.getPublicKey().toBytes() );

		const sbBytes = fromHEX( sb )
		const h = sha256( sha256( sbBytes ) );

		const sig = secp256k1.sign( h, this.keypair.secretKey, { lowS: true, } );
		let sign = sig.toCompactRawBytes();

		const r = sign.slice(0, 32);
		const s = sign.slice(32, 64);
		const result =  {
			"r": toHEX(r),
			"s": toHEX(s),
		};
		return result;
	}

}
