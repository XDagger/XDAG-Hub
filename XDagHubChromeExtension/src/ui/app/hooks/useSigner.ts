import { useAccounts } from "./useAccounts";
import { useActiveAccount } from "./useActiveAccount";
import useAppSelector from "./useAppSelector";
import { type WalletSigner } from "_app/WalletSigner";
import { thunkExtras } from "_redux/store/thunk-extras";

import type { XDagAddress } from "_src/xdag/typescript/types";

export function useSigner(address?: XDagAddress): WalletSigner | null {
  const activeAccount = useActiveAccount();
  // const existingAccounts = useAccounts();
  // const signerAccount = address ? existingAccounts.find((account) => account.address === address) : activeAccount;
  const signerAccount = activeAccount;

  const { api, background } = thunkExtras;
  const networkName = useAppSelector(({ app: { apiEnv } }) => apiEnv);
  if (!signerAccount) {
    throw new Error("Can't find account for the signer address " );
  }

  return api.getSignerInstance(signerAccount, background);
}
