import { useLocation } from "react-router-dom";
import { useActiveAccount } from "./useActiveAccount";
import useAppSelector from "./useAppSelector";
import { AppType } from "../redux/slices/app/AppType";

export function useInitialPageView() {
  const activeAccount = useActiveAccount();
  const location = useLocation();
  const { apiEnv, customRPC, activeOrigin, appType } = useAppSelector(
    (state) => state.app,
  );
  const activeNetwork =
    customRPC && apiEnv === "customRPC" ? customRPC : apiEnv.toUpperCase();
  const isFullScreen = appType === AppType.fullscreen;
}
