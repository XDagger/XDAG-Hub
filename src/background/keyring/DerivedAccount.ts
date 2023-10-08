import { type Account, AccountType } from "./Account";
import { AccountKeypair } from "./AccountKeypair";
import type { Keypair } from "_src/xdag/typescript/cryptography";
import type { XDagAddress} from "_src/xdag/typescript/types";

export type SerializedDerivedAccount = {
  type: AccountType.DERIVED;
  address: XDagAddress;
  derivationPath: string;
};

export class DerivedAccount implements Account {
  readonly accountKeypair: AccountKeypair;
  readonly type: AccountType;
  readonly address: XDagAddress;
  readonly derivationPath: string;

  constructor({ derivationPath, keypair, }: { derivationPath: string; keypair: Keypair; }) {
    this.type = AccountType.DERIVED;
    this.derivationPath = derivationPath;
    this.accountKeypair = new AccountKeypair(keypair);
    this.address = this.accountKeypair.publicKey.toXDagAddress();
  }

  toJSON(): SerializedDerivedAccount {
    return {
      type: AccountType.DERIVED,
      address: this.address,
      derivationPath: this.derivationPath,
    };
  }

  getPublicKey() {
    return this.accountKeypair.publicKey.toBase64();
  }
}
