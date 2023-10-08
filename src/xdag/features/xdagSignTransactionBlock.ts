import type { IdentifierString, WalletAccount } from "@wallet-standard/core";
import type { TransactionBlock } from "_src/xdag/typescript/builder";
import type { SignedTransaction } from "_src/xdag/typescript/signers/types";

/** The latest API version of the signTransactionBlock API. */
export type XdagSignTransactionBlockVersion = "1.0.0";

/**
 * A Wallet Standard feature for signing a transaction, and returning the
 * serialized transaction and transaction signature.
 */
export type XdagSignTransactionBlockFeature = {
	/** Namespace for the feature. */
	"sui:signTransactionBlock": {
		/** Version of the feature API. */
		version: XdagSignTransactionBlockVersion;
		signTransactionBlock: XdagSignTransactionBlockMethod;
	};
};

export type XdagSignTransactionBlockMethod = (
	input: XdagSignTransactionBlockInput,
) => Promise<XdagSignTransactionBlockOutput>;

/** Input for signing transactions. */
export interface XdagSignTransactionBlockInput
{
	transactionBlock: TransactionBlock;
	account: WalletAccount;
	chain: IdentifierString;
}

/** Output of signing transactions. */
export interface XdagSignTransactionBlockOutput extends SignedTransaction
{}
