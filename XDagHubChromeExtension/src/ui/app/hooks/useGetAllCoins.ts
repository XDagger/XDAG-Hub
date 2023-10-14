import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "_src/xdag/api";
import type { XDagAddress, PaginatedCoins, CoinStruct } from "_src/xdag/typescript/types";

const MAX_COINS_PER_REQUEST = 100;

// Fetch all coins for an address, this will keep calling the API until all coins are fetched
export function useGetAllCoins(coinType: string, address?: XDagAddress | null) {
  const rpc = useRpcClient();
  return useQuery({
    queryKey: ["get-all-coins", address, coinType],
    queryFn: async () => {
      let cursor: string | null = null;
      const allData: CoinStruct[] = [];
      // keep fetching until cursor is null or undefined
      do {
        const { data, nextCursor }: PaginatedCoins = await rpc.getCoins({ owner: address!, coinType });
        if (!data || !data.length) {
          break;
        }
        allData.push(...data);
        cursor = nextCursor;
      } while (cursor);
      return allData;
    },
    enabled: !!address,
  });
}
