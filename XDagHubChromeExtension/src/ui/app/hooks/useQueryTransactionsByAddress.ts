import { useQuery } from "@tanstack/react-query";
import { XDagAddress, XDagTransactionBlockResponse } from "_src/xdag/typescript/types";
import { useRpcClient } from "_src/xdag/api";

export function useQueryTransactionsByAddress( address: XDagAddress | null ) {
	const rpc = useRpcClient();
	return useQuery( {
		queryKey: [ "transactions-by-address", address ],
		queryFn: async () => {
			return await rpc.queryAddressBlock( { XDagAddress: address!, } );
		},
		enabled: !!address,
		refetchInterval: 6 * 1000,
	} );
}
