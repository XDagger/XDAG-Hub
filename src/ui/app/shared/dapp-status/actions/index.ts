import { createAsyncThunk } from "@reduxjs/toolkit";
import type { XDagAddress } from "_src/xdag/typescript/types";
import type { AppThunkConfig } from "_redux/store/thunk-extras";

export const appDisconnect = createAsyncThunk<
  void,
  { origin: string; accounts: XDagAddress[] },
  AppThunkConfig
>(
  "dapp-status-app-disconnect",
  async ({ origin, accounts }, { extra: { background } }) => {
    await background.disconnectApp(origin, accounts);
    await background.sendGetPermissionRequests();
  },
);
