
import type { XDagAddress } from "_src/xdag/typescript/types";


export function isValidXDagAddress( value: string ): value is XDagAddress {
	let res = (/^([1-9A-HJ-NP-Za-km-z]+)+$/.test( value )) && (value.length === 33);
	return res;
}

export function normalizeXDagAddress( value: string, forceAdd0x: boolean = false, ): XDagAddress {
	let address = value;
	if ( !forceAdd0x && address.startsWith( "0x" ) ) {
		address = address.slice( 2 );
	}
	return address;
}

