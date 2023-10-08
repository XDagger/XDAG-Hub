import { type BasePayload, isBasePayload } from "../BasePayload";
import { type Payload } from "../Payload";
import type { XdagSignMessageOutput } from "_src/xdag/features";
import type { XDagAddress } from "_src/xdag/typescript/types";

export interface SignMessageRequest extends BasePayload
{
	type: "sign-message-request";
	args?: {
		message: string; // base64
		accountAddress: XDagAddress;
	};
	return?: XdagSignMessageOutput;
}

export function isSignMessageRequest(
	payload: Payload,
): payload is SignMessageRequest {
	return isBasePayload( payload ) && payload.type === "sign-message-request";
}
