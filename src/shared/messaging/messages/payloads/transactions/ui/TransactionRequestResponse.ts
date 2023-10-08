import { isBasePayload } from "_payloads";
import type { BasePayload, Payload } from "_payloads";
import type { XdagSignMessageOutput } from "_src/xdag/features";
import type { SignedTransaction } from "_src/xdag/typescript/signers";
import type { XDagTransactionBlockResponse } from "_src/xdag/typescript/types";

export interface TransactionRequestResponse extends BasePayload
{
	type: "transaction-request-response";
	txID: string;
	approved: boolean;
	txResult?: XDagTransactionBlockResponse | XdagSignMessageOutput;
	txResultError?: string;
	txSigned?: SignedTransaction;
}

export function isTransactionRequestResponse(
	payload: Payload,
): payload is TransactionRequestResponse {
	return (
		isBasePayload( payload ) && payload.type === "transaction-request-response"
	);
}
