import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "_src/xdag/api";
import type { XDagAddress, CoinBalance } from "_src/xdag/typescript/types";

export function useGetAllBalances<TResult = CoinBalance[]>(
  address?: XDagAddress | null,
  refetchInterval?: number,
  staleTime?: number,
  select?: (data: CoinBalance[]) => TResult,
) {
  const rpc = useRpcClient();
  return useQuery({
    queryKey: ["get-all-balance", address],
    queryFn: () => rpc.getAllBalances({ owner: address! }),
    enabled: !!address,
    refetchInterval,
    staleTime,
    select,
  });
}
