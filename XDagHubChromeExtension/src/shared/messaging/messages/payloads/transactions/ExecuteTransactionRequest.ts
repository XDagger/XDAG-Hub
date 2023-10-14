import { type TransactionDataType } from "./ApprovalRequest";
import { isBasePayload } from "_payloads";
import {
  type XDagAddress
} from "_src/xdag/typescript/types";
import type { XdagSignTransactionBlockInput } from "_src/xdag/features";
import type { BasePayload, Payload } from "_payloads";

export interface ExecuteTransactionRequest extends BasePayload {
  type: "execute-transaction-request";
  transaction: TransactionDataType;
}

export function isExecuteTransactionRequest(
  payload: Payload,
): payload is ExecuteTransactionRequest {
  return (isBasePayload(payload) && payload.type === "execute-transaction-request");
}

export type XdagSignTransactionSerialized = Omit<XdagSignTransactionBlockInput, "transaction" | "account"> & {
  transaction: string;
  account: XDagAddress;
};

export interface SignTransactionRequest extends BasePayload {
  type: "sign-transaction-request";
  transaction: XdagSignTransactionSerialized;
}

export function isSignTransactionRequest(
  payload: Payload,
): payload is SignTransactionRequest {
  return isBasePayload(payload) && payload.type === "sign-transaction-request";
}
