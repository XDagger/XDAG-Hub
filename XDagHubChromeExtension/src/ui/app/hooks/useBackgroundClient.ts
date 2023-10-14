import { thunkExtras } from "../redux/store/thunk-extras";

export function useBackgroundClient() {
  return thunkExtras.background;
}
