import { isBasePayload } from "_payloads";
import type { XDagAddress } from "_src/xdag/typescript/types";
import type { BasePayload, Payload } from "_payloads";

export interface DisconnectApp extends BasePayload {
  type: "disconnect-app";
  origin: string;
  specificAccounts?: XDagAddress[];
}

export function isDisconnectApp(payload: Payload): payload is DisconnectApp {
  return isBasePayload(payload) && payload.type === "disconnect-app";
}
