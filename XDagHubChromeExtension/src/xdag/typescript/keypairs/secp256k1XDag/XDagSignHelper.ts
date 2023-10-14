import { ripemd160 } from "@noble/hashes/ripemd160";
import { sha256 } from "@noble/hashes/sha256";
import { fromB58, fromHEX, toHEX } from "_src/xdag/bcs";
import { Keypair } from "_src/xdag/typescript/cryptography";
import { string } from "superstruct";
import BigNumber from "bignumber.js";
import { Buffer } from "buffer";

	export function checkBase58Address( address: string ): string {
		const addrBytes: Uint8Array = fromB58( address ).reverse();
		if ( addrBytes.length !== 24 ) {
			console.error( 'Transaction receive address length error' );
			return "";
		}
		const sublist = addrBytes.slice( addrBytes.length - 20 , addrBytes.length);
		const addrHex = toHEX(sublist)
		return `00000000${ addrHex }`;
	}

	export function  xDag2Amount( value: number ): bigint {
		const amount = Math.floor( value );
		//===move integer to 32-63 / 64
		let res = BigInt( amount ) << BigInt( 32 );
		//===move fraction to 0-31 / 64
		value -= amount;
		value *= Math.pow( 2, 32 );
		const decimalPart = Math.ceil( value );
		//===reassemble a new value which is a bigint without fraction
		res += BigInt( decimalPart );
		return res;
	}

	export function getCurrentTimestamp(): bigint {
		const t0 = Date.now();
		const t = BigInt( t0 ) * BigInt( 1000000 );
		const sec = t / BigInt( 1000000000 );
		const usec = (t - sec * BigInt( 1000000000 )) / BigInt( 1000 );
		const xmsec = (usec << BigInt( 10 )) / BigInt( 1000000 );
		return (sec << BigInt( 10 )) | xmsec;
	}

	export function checkAddress( address: string ): boolean {
		try {
			if ( address.length === 0 ) return false;

			const addrBytes = fromB58( address )
			if ( addrBytes.length !== 24 ) {
				return false;
			}

			const addrBytes20: Uint8Array = addrBytes.slice( 0, 20 );
			const addrBytes4: Uint8Array = addrBytes.slice( 20, 24 );

			const checksum = sha256( sha256( addrBytes20 ) ).slice( 0, 4 );
			for ( let i = 0; i < 4; i++ ) {
				if ( addrBytes4[ i ] !== checksum[ i ] ) {
					console.error( ' failed to validate XDag address!', checksum, addrBytes4 )
					return false;
				}
			}
			return true;
		} catch ( e ) {
			return false;
		}
	}
