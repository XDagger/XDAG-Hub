import { isBasePayload } from "_payloads";
import type { BasePayload, Payload } from "_payloads";

export interface HasPermissionsResponse extends BasePayload {
  type: "has-permissions-response";
  result: boolean;
}

export function isHasPermissionResponse(
  payload: Payload,
): payload is HasPermissionsResponse {
  return isBasePayload(payload) && payload.type === "has-permissions-response";
}
