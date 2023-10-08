import { useQuery } from "@tanstack/react-query";
import { useFormatCoin } from "_shared/hooks";
import { useRpcClient } from "_src/xdag/api";
import { TransactionBlock } from "_src/xdag/typescript/builder";
import type { XDagAddress } from "_src/xdag/typescript/types";
import { XDAG_TYPE_ARG } from "_src/xdag/typescript/framework";
import BigNumber from "bignumber.js";

export function useTransactionData(
	sender?: XDagAddress | null,
	transaction?: TransactionBlock | null,
) {
	const rpc = useRpcClient();
	return useQuery( {
		queryKey: [ "transaction-data", transaction?.serialize() ],
		queryFn: async () => {
			const clonedTransaction = new TransactionBlock( transaction! );
			if ( sender ) {
				clonedTransaction.setSenderIfNotSet( sender );
			}
			// Build the transaction to bytes, which will ensure that the transaction data is fully populated:
			await clonedTransaction!.build( { client: rpc } );
			return clonedTransaction!.blockData;
		},
		enabled: !!transaction,
	} );
}

export function useTransactionGasBudget(
	sender?: XDagAddress | null,
	transaction?: TransactionBlock | null,
) {
	const { data, ...rest } = useTransactionData( sender, transaction );

	const [ formattedGas ] = useFormatCoin( BigNumber((data?.gasConfig.budget??"0").toString()), XDAG_TYPE_ARG );

	return {
		data: formattedGas,
		...rest,
	};
}
