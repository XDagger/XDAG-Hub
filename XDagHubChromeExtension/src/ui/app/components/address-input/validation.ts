import { useMemo } from "react";
import * as Yup from "yup";
import { useRpcClient } from "_src/xdag/api";
import { isValidXDagAddress } from "_src/xdag/typescript/types";
import i18next from "i18next";

export function createXDagAddressValidation() {
	return Yup.string()
		.ensure()
		.trim()
		.required()
		.test(
			"is-xDag-address",
			i18next.t("createXDagAddressValidation.InvalidAddress"),
			async ( value ) => {
				return isValidXDagAddress( value );
			},
		)
		.label( "Recipient's address" );
}

export function useXDagAddressValidation() {
	return useMemo( () => {
		return createXDagAddressValidation();
	}, [] );
}