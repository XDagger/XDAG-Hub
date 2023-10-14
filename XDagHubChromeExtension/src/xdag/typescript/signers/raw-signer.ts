import { blake2b } from "@noble/hashes/blake2b";
import { SignerWithProvider } from "./signer-with-provider.js";
import { toSerializedSignature } from "../cryptography/signature.js";
import type { XdagClient } from "../client/index.js";
import type { Keypair } from "../cryptography/keypair.js";
import type { SerializedSignature } from "../cryptography/signature.js";
import type { JsonRpcProvider } from "../rpc/json-rpc-provider.js";
import type { XDagAddress } from "../types/index.js";

export class RawSigner extends SignerWithProvider {
  private readonly keypair: Keypair;

  constructor(keypair: Keypair, client: JsonRpcProvider | XdagClient) {
    super(client);
    this.keypair = keypair;
  }

  async getAddress(): Promise<XDagAddress> {
    return this.keypair.getPublicKey().toXDagAddress();
  }

  async signData(data: Uint8Array): Promise<SerializedSignature> {
    const pubkey = this.keypair.getPublicKey();
    const digest = blake2b(data, { dkLen: 32 });
    const signature = this.keypair.signData(digest);
    const signatureScheme = this.keypair.getKeyScheme();
    return toSerializedSignature({
      signatureScheme,
      signature,
      pubKey: pubkey,
    });
  }

  async signDataByType(data: Uint8Array, signType:string ): Promise<SerializedSignature> {
    const pubkey = this.keypair.getPublicKey();
    const digest = blake2b(data, { dkLen: 32 });
    const signature = this.keypair.signData(digest);
    const signatureScheme = this.keypair.getKeyScheme();
    return toSerializedSignature({
      signatureScheme,
      signature,
      pubKey: pubkey,
    });
  }

  connect(client: XdagClient | JsonRpcProvider): SignerWithProvider {
    return new RawSigner(this.keypair, client);
  }
}
