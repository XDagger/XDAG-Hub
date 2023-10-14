import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "_src/xdag/api";
import type { XDagAddress } from "_src/xdag/typescript/types";

export function useGetCoinBalance(
  coinType: string,
  address?: XDagAddress | null,
  refetchInterval?: number,
  staleTime?: number,
) {
  const rpc = useRpcClient();
  return useQuery({
    queryKey: ["coin-balance", address, coinType],
    queryFn: () => rpc.getBalance({ owner: address!, coinType }),
    enabled: !!address && !!coinType,
    refetchInterval,
    staleTime,
  });
}
