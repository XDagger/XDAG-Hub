import { isBasePayload } from "_payloads";
import type { BasePayload, Payload } from "_payloads";
import type { XDagAddress } from "_src/xdag/typescript/types";

export interface PermissionResponse extends BasePayload {
  type: "permission-response";
  id: string;
  accounts: XDagAddress[];
  allowed: boolean;
  responseDate: string;
}

export function isPermissionResponse(
  payload: Payload,
): payload is PermissionResponse {
  return isBasePayload(payload) && payload.type === "permission-response";
}
