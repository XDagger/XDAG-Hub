import useAppSelector from "./useAppSelector";
import { activeAddressSelector } from "../redux/slices/account";

export function useActiveAddress() {
  return useAppSelector(activeAddressSelector);
}
