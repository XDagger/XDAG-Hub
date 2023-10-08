import { isBasePayload } from "_payloads";

import type { BasePayload, Payload } from "_payloads";

export interface StakeRequest extends BasePayload {
  type: "stake-request";
  validatorAddress: string;
}

export function isStakeRequest(payload: Payload): payload is StakeRequest {
  return isBasePayload(payload) && payload.type === "stake-request";
}
