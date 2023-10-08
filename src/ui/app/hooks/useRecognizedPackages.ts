import useAppSelector from "./useAppSelector";
import { API_ENV } from "_src/shared/api-env";
import { XDAG_FRAMEWORK_ADDRESS, XDAG_SYSTEM_ADDRESS } from "_src/xdag/typescript/framework";

const DEFAULT_RECOGNIZED_PACKAGES = [
  XDAG_FRAMEWORK_ADDRESS,
  XDAG_SYSTEM_ADDRESS,
];

export function useRecognizedPackages() {
  const apiEnv = useAppSelector((app) => app.app.apiEnv);
  const recognizedPackages = DEFAULT_RECOGNIZED_PACKAGES;
  //useFeatureValue(
  //   "recognized-packages",
  //   DEFAULT_RECOGNIZED_PACKAGES,
  // );
  // Our recognized package list is currently only available on mainnet
  return apiEnv === API_ENV.mainnet
    ? recognizedPackages
    : DEFAULT_RECOGNIZED_PACKAGES;
}
