import { useMemo } from "react";
import * as Yup from "yup";
import { useRpcClient } from "_src/xdag/api";
import { isValidXDagAddress } from "_src/xdag/typescript/types";

export function createXDagAddressValidation() {
	return Yup.string()
		.ensure()
		.trim()
		.required()
		.test(
			"is-xDag-address",
			"Invalid address. Please check again.",
			async ( value ) => {
				return isValidXDagAddress( value );
			},
		)
		.label( "Recipient's address" );
}

export function useXDagAddressValidation() {
	return useMemo( () => {
		return createXDagAddressValidation( );
	}, [] );
}