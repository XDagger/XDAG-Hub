
export function useCoinsReFetchingConfig() {
  // const refetchInterval = useFeatureValue(
  //   FEATURES.WALLET_BALANCE_REFETCH_INTERVAL,
  //   20_000,
  // );
  return {
    refetchInterval:20_000,
    staleTime: 5_000,
  };
}
