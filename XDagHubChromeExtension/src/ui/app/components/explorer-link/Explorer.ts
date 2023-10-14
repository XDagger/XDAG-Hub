import { DEFAULT_API_ENV } from "_app/ApiProvider/ApiProvider";
import { API_ENV } from "_src/shared/api-env";
import type { XDagAddress } from "_src/xdag/typescript/types";

const API_ENV_TO_EXPLORER_ENV: Record<API_ENV, string | undefined> = {
  [API_ENV.local]: "local",
  [API_ENV.devNet]: "devnet",
  [API_ENV.testNet]: "testnet",
  [API_ENV.mainnet]: "https://mainnet-explorer.xdagj.org",
  [API_ENV.customRPC]: "",
};

// const EXPLORER_LINK = "https://mainnet-explorer.xdagj.org";
function getExplorerUrl( path: string, apiEnv: API_ENV = DEFAULT_API_ENV, customRPC: string, ) {
  const explorerEnv = apiEnv === "customRPC" ? customRPC : API_ENV_TO_EXPLORER_ENV[apiEnv];
  const url = `${explorerEnv}${path}`
  return url
}

export function getTransactionUrl(
  transactionBlockAddress: string,
  apiEnv: API_ENV,
  customRPC: string,
) {
  return getExplorerUrl( `/block/${transactionBlockAddress}`, apiEnv, customRPC);
}

export function getMainBlockUrl(
  address: XDagAddress,
  apiEnv: API_ENV,
  customRPC: string,
) {
  return getExplorerUrl(`/block/${address}`, apiEnv, customRPC);
}

