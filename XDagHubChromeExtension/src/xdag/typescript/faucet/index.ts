import type {
  ObjectId,
  XDagAddress,
  TransactionDigest,
} from "../types/index.js";

export class FaucetRateLimitError extends Error {}

type FaucetCoinInfo = {
  amount: number;
  id: ObjectId;
  transferTxDigest: TransactionDigest;
};

type FaucetResponse = {
  transferredGasObjects: FaucetCoinInfo[];
  error?: string | null;
};


async function faucetRequest(
  host: string,
  path: string,
  body: Record<string, any>,
  headers?: HeadersInit,
) {
  const endpoint = new URL(path, host).toString();
  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  if (res.status === 429) {
    throw new FaucetRateLimitError(
      `Too many requests from this client have been sent to the faucet. Please retry later`,
    );
  }

  try {
    const parsed = await res.json();
    if (parsed.error) {
      throw new Error(`Faucet returns error: ${parsed.error}`);
    }
    return parsed;
  } catch (e) {
    throw new Error(
      `Encountered error when parsing response from faucet, error: ${e}, status ${res.status}, response ${res}`,
    );
  }
}

export async function requestXdagFromFaucetV0(input: {
  host: string;
  recipient: XDagAddress;
  headers?: HeadersInit;
}): Promise<FaucetResponse> {
  return faucetRequest(
    input.host,
    "/gas",
    {
      FixedAmountRequest: {
        recipient: input.recipient,
      },
    },
    input.headers,
  );
}
