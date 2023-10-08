import type { IdentifierString, WalletAccount } from "@wallet-standard/core";
import type { TransactionBlock } from "_src/xdag/typescript/builder";
import type { SignedTransaction } from "_src/xdag/typescript/signers/types";

export type XdagSignTransactionBlockMethod = (
  input: XdagSignTransactionBlockInput,
) => Promise<XdagSignTransactionBlockOutput>;

/** Input for signing transactions. */
export interface XdagSignTransactionBlockInput {
  transactionBlock: TransactionBlock;
  account: WalletAccount;
  chain: IdentifierString;
}

/** Output of signing transactions. */
export interface XdagSignTransactionBlockOutput extends SignedTransaction {}
