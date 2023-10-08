export function CoinActivitiesCard({ coinType }: { coinType: string }) {

  return (
    <div className="flex flex-col flex-nowrap ">
      <div className="flex-grow overflow-y-auto px-5 -mx-5 divide-y divide-solid divide-gray-45 divide-x-0">
        {/* <Loading loading={isLoading}>
                    {txnByCoinType?.length && activeAddress
                        ? txnByCoinType.map((txn) => (
                              <ErrorBoundary key={getTransactionDigest(txn)}>
                                  <TransactionCard
                                      txn={txn}
                                      address={activeAddress}
                                  />
                              </ErrorBoundary>
                          ))
                        : null}
                </Loading> */}
      </div>
    </div>
  );
}
