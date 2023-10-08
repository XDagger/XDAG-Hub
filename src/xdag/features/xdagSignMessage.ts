import type { WalletAccount } from "@wallet-standard/core";
import type { SignedMessage } from "_src/xdag/typescript/signers/types";

/** The latest API version of the signMessage API. */
export type XdagSignMessageVersion = "1.0.0";

/**
 * A Wallet Standard feature for signing a personal message, and returning the
 * message bytes that were signed, and message signature.
 */
export type XdagSignMessageFeature = {
  /** Namespace for the feature. */
  "xdag:signMessage": {
    /** Version of the feature API. */
    version: XdagSignMessageVersion;
    signMessage: XdagSignMessageMethod;
  };
};

export type XdagSignMessageMethod = (
  input: XdagSignMessageInput,
) => Promise<XdagSignMessageOutput>;

/** Input for signing messages. */
export interface XdagSignMessageInput {
  message: Uint8Array;
  account: WalletAccount;
}

/** Output of signing messages. */
export interface XdagSignMessageOutput extends SignedMessage {}
