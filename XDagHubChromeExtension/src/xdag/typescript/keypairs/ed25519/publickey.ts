
import {
  SIGNATURE_SCHEME_TO_FLAG,
  PublicKey,
  PublicKeyInitData
} from "../../cryptography";
import { fromB64, toHEX } from "_src/xdag/bcs";
import { normalizeXDagAddress, } from "_src/xdag/typescript/types";
import { blake2b } from "@noble/hashes/blake2b";

const PUBLIC_KEY_SIZE = 32;
const XDAG_ADDRESS_LENGTH = 33
/**
 * An Ed25519 public key
 */
export class Ed25519PublicKey extends PublicKey {
  static SIZE = PUBLIC_KEY_SIZE;
  private data: Uint8Array;

  constructor(value: PublicKeyInitData) {
    super();

    if (typeof value === "string") {
      this.data = fromB64(value);
    } else if (value instanceof Uint8Array) {
      this.data = value;
    } else {
      this.data = Uint8Array.from(value);
    }

    if (this.data.length !== PUBLIC_KEY_SIZE) {
      throw new Error(
        `Invalid public key input. Expected ${PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`,
      );
    }
  }
  override equals(publicKey: Ed25519PublicKey): boolean {
    return super.equals(publicKey);
  }

  toBytes(): Uint8Array {
    return this.data;
  }


  toXDagAddress(): string {
    let tmp = new Uint8Array(PUBLIC_KEY_SIZE + 1);
    tmp.set([SIGNATURE_SCHEME_TO_FLAG["ED25519"]]);
    tmp.set(this.toBytes(), 1);
    // Each hex char represents half a byte, hence hex address doubles the length
    return normalizeXDagAddress(
      toHEX(blake2b(tmp, { dkLen: 32 })).slice(0, XDAG_ADDRESS_LENGTH * 2),
    );
  }

  flag(): number {
    return SIGNATURE_SCHEME_TO_FLAG["ED25519"];
  }
}
