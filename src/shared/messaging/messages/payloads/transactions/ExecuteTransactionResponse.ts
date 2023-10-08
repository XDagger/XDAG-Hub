import { isBasePayload } from "_payloads";
import type { BasePayload, Payload } from "_payloads";
import type { XDagTransactionBlockResponse } from "_src/xdag/typescript/types";
import type { XdagSignTransactionBlockOutput } from "_src/xdag/supplement/XdagSignTransactionBlock";

export interface ExecuteTransactionResponse extends BasePayload {
  type: "execute-transaction-response";
  result: XDagTransactionBlockResponse;
}

export function isExecuteTransactionResponse(
  payload: Payload,
): payload is ExecuteTransactionResponse {
  return (
    isBasePayload(payload) && payload.type === "execute-transaction-response"
  );
}

export interface SignTransactionResponse extends BasePayload {
  type: "sign-transaction-response";
  result: XdagSignTransactionBlockOutput;
}

export function isSignTransactionResponse(
  payload: Payload,
): payload is SignTransactionResponse {
  return isBasePayload(payload) && payload.type === "sign-transaction-response";
}
