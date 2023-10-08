import { isBasePayload } from "_payloads";
import type { XDagAddress } from "_src/xdag/typescript/types";
import type { BasePayload, Payload } from "_payloads";
import type { NetworkEnvType } from "_src/background/NetworkEnv";

export type WalletStatusChange = {
  network?: NetworkEnvType;
  accounts?: { address: XDagAddress; publicKey: string | null }[];
};

export interface WalletStatusChangePayload
  extends BasePayload,
    WalletStatusChange {
  type: "wallet-status-changed";
}

export function isWalletStatusChangePayload(
  payload: Payload,
): payload is WalletStatusChangePayload {
  return isBasePayload(payload) && payload.type === "wallet-status-changed";
}
