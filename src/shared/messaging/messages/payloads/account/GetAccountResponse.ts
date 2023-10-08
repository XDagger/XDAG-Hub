import type { BasePayload } from "_payloads";
import type { XDagAddress } from "_src/xdag/typescript/types";

export interface GetAccountResponse extends BasePayload {
  type: "get-account-response";
  accounts: { address: XDagAddress; publicKey: string | null }[];
}
