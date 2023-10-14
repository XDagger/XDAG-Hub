import useAppSelector from "./useAppSelector";
import { activeAccountSelector } from "../redux/slices/account";

export function useActiveAccount() {
  return useAppSelector(activeAccountSelector);
}
