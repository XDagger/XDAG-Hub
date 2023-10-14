import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CoinItem } from "_components/active-coins-card/CoinItem";
import { type CoinBalance } from "_src/xdag/typescript/types";
import BigNumber from "bignumber.js";

type Props = {
  coinBalance: CoinBalance;
  centerAction?: ReactNode;
};

export function TokenLink({ coinBalance, centerAction }: Props) {
  return (
    <Link
      to={`/send?type=${encodeURIComponent(coinBalance.coinType)}`}
      key={coinBalance.coinType}
      className="no-underline w-full group/coin"
    >
      <CoinItem
        coinType={coinBalance.coinType}
        balance={BigNumber(coinBalance.totalBalance)}
        centerAction={centerAction}
      />
    </Link>
  );
}
