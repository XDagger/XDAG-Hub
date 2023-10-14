import type { SerializedSignature } from "_src/xdag/typescript/cryptography";
import type { SignedMessage} from "_src/xdag/typescript/signers/types";
import type { SignedTransaction} from "_src/xdag/typescript/signers/types";
import type { TransactionBlock} from "_src/xdag/typescript/builder";
import {SignerWithProvider } from "_src/xdag/typescript/signers/signer-with-provider";
import { XDagTransactionBlockResponse } from "_src/xdag/typescript/types";

export abstract class WalletSigner extends SignerWithProvider {
  abstract signData(
    data: Uint8Array,
    clientIdentifier?: string,
  ): Promise<SerializedSignature>;

  async signMessage(
    input: { message: Uint8Array },
    clientIdentifier?: string,
  ): Promise<SignedMessage> {
    return super.signMessage(input);
  }

  async signTransactionBlock(
    input: { transactionBlock: Uint8Array | TransactionBlock; },
    clientIdentifier?: string,
  ): Promise<SignedTransaction> {
    return super.signTransactionBlock(input);
  }

  async signAndExecuteTransactionBlockByType( transactionBlock: Uint8Array | TransactionBlock,signeType: string)
    : Promise<XDagTransactionBlockResponse> {
    return super.signAndExecuteTransactionBlockByType(transactionBlock, signeType);
  }
}
