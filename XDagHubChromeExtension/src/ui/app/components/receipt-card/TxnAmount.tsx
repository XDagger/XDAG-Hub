import { useFormatCoin } from "_shared/hooks";
import { Heading } from "_src/ui/app/shared/heading";
import { Text } from "_src/ui/app/shared/text";
import BigNumber from "bignumber.js";

type TxnAmountProps = {
  amount: string | number;
  coinType: string;
  label: string;
  approximation?: boolean;
};

// dont show amount if it is 0
// This happens when a user sends a transaction to self;
export function TxnAmount({
  amount,
  coinType,
  label,
  approximation,
}: TxnAmountProps) {
  const [formatAmount, symbol] = useFormatCoin(
    BigNumber(Math.abs(Number(amount)).toString()),
    coinType,
  );
  return Number(amount) !== 0 ? (
    <div className="flex justify-between w-full items-center py-3.5 first:pt-0">
      <Text variant="body" weight="medium" color="steel-darker">
        {label}
      </Text>
      <div className="flex gap-1 items-center">
        <Heading variant="heading2" weight="semibold" color="gray-90">
          {approximation ? "~" : ""}
          {formatAmount}
        </Heading>
        <Text variant="body" weight="medium" color="steel-darker">
          {symbol}
        </Text>
      </div>
    </div>
  ) : null;
}
