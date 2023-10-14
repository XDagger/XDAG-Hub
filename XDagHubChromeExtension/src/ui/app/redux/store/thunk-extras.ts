import ApiProvider from "_app/ApiProvider/ApiProvider";
import { BackgroundClient } from "_app/background-client";
import type { RootState } from "_redux/RootReducer";
import type { AppDispatch } from "_store";


export const api = new ApiProvider();

export const thunkExtras = {
  api,
  background: new BackgroundClient(),
};

type ThunkExtras = typeof thunkExtras;

export interface AppThunkConfig {
  extra: ThunkExtras;
  state: RootState;
  dispatch: AppDispatch;
}
