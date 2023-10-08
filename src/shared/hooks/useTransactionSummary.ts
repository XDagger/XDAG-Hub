import {
	XDagTransactionDirectionTypeText,
} from "_src/xdag/typescript/types";
import type { XDagAddress, XDagTransactionBlockResponse } from "_src/xdag/typescript/types";

export function useTransactionSummary( { transaction, currentAddress, }: {
	transaction?: XDagTransactionBlockResponse ;
	currentAddress?: XDagAddress;
} ) {
	let sender = "";
	if( transaction?.refs ){
		for ( const ref of transaction.refs ) {
				if( XDagTransactionDirectionTypeText[ref.direction] === "OUTPUT" ){
					sender = ref.address;
				}
		}
	}
	return {
		sender: sender,
		balanceChanges: null,
		digest: transaction?.address??"",
		label: "label",
		objectSummary: null
	};
}
