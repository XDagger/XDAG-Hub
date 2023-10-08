import { Text } from "_app/shared/text";
import { useFormatCoin } from "_shared/hooks";
import { XDAG_TYPE_ARG } from "_src/xdag/typescript/framework";
import BigNumber from "bignumber.js";

interface CoinBalanceProps {
  amount: bigint | number | string;
  coinType?: string;
}

export function CoinBalance({ amount, coinType }: CoinBalanceProps) {
  const [formatted, symbol] = useFormatCoin(BigNumber((amount??"0").toString()), coinType || XDAG_TYPE_ARG);

  return Math.abs(Number(amount)) > 0 ? (
    <div className="flex gap-0.5 align-baseline flex-nowrap items-baseline">
      <Text variant="body" weight="semibold" color="gray-90">
        {formatted}
      </Text>
      <Text variant="subtitle" color="gray-90" weight="medium">
        {symbol}
      </Text>
    </div>
  ) : null;
}
