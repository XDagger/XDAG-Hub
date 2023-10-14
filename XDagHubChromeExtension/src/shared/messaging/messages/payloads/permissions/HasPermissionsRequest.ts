import { isBasePayload } from "_payloads";
import type { PermissionType } from "./PermissionType";
import type { BasePayload, Payload } from "_payloads";

export interface HasPermissionsRequest extends BasePayload {
  type: "has-permissions-request";
  permissions: readonly PermissionType[];
}

export function isHasPermissionRequest(
  payload: Payload,
): payload is HasPermissionsRequest {
  return isBasePayload(payload) && payload.type === "has-permissions-request";
}
