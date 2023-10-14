import { type Account, AccountType } from "./Account";
import { AccountKeypair } from "./AccountKeypair";
import type { Keypair } from "_src/xdag/typescript/cryptography";
import type { XDagAddress} from "_src/xdag/typescript/types";

export type SerializedImportedAccount = {
  type: AccountType.IMPORTED;
  address: XDagAddress;
  derivationPath: null;
};

export class ImportedAccount implements Account {
  readonly accountKeypair: AccountKeypair;
  readonly type: AccountType;
  readonly address: XDagAddress;

  constructor({ keypair }: { keypair: Keypair }) {
    this.type = AccountType.IMPORTED;
    this.accountKeypair = new AccountKeypair(keypair);
    this.address = this.accountKeypair.publicKey.toXDagAddress();
  }

  toJSON(): SerializedImportedAccount {
    return {
      type: AccountType.IMPORTED,
      address: this.address,
      derivationPath: null,
    };
  }

  getPublicKey() {
    return this.accountKeypair.publicKey.toBase64();
  }
}
