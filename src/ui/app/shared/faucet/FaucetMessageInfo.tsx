import { GAS_TYPE_ARG } from "_redux/slices/xdag-objects/Coin";
import { useFormatCoin } from "_shared/hooks";
import BigNumber from "bignumber.js";

export type FaucetMessageInfoProps = {
  error?: string | null;
  loading?: boolean;
  totalReceived?: number | null;
};

function FaucetMessageInfo({
  error = null,
  loading = false,
  totalReceived = null,
}: FaucetMessageInfoProps) {
  const [coinsReceivedFormatted, coinsReceivedSymbol] = useFormatCoin(
    BigNumber((totalReceived??0).toString()),
    GAS_TYPE_ARG,
  );
  if (loading) {
    return <>Request in progress</>;
  }
  if (error) {
    return <>{error}</>;
  }
  return (
    <>{`${
      totalReceived ? `${coinsReceivedFormatted} ` : ""
    }${coinsReceivedSymbol} received`}</>
  );
}

export default FaucetMessageInfo;
