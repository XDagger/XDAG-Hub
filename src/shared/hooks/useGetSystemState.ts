import { useQuery } from "@tanstack/react-query";
import { useRpcClient } from "_src/xdag/api";

export function useGetSystemState() {
  const rpc = useRpcClient();
  return useQuery({
    queryKey: ["system", "state"],
    queryFn: () => {}//rpc.getLatestXdagSystemState(),
  });
}
