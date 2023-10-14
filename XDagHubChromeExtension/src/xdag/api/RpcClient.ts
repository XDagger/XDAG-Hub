import { createContext, useContext } from "react";
import type { JsonRpcProvider} from "_src/xdag/typescript/rpc/json-rpc-provider";

export const RpcClientContext = createContext<JsonRpcProvider | undefined>(
  undefined,
);

export function useRpcClient() {
  const rpcClient = useContext(RpcClientContext);
  if (!rpcClient) {
    throw new Error("useRpcClient must be within RpcClientContext");
  }
  return rpcClient;
}
