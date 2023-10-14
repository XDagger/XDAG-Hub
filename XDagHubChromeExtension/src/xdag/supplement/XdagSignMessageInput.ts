import { type SignedMessage } from "_src/xdag/typescript/signers/types";
import type { WalletAccount } from "@wallet-standard/core";

export type XdagSignMessageMethod = (
  input: XdagSignMessageInput,
) => Promise<XdagSignMessageOutput>;

export interface XdagSignMessageInput {
  message: Uint8Array;
  account: WalletAccount;
}

export interface XdagSignMessageOutput extends SignedMessage {}
