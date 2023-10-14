import { type CoinBalance } from "_src/xdag/typescript/types";
import { Coin } from "_src/xdag/typescript/framework";

export function filterAndSortTokenBalances(tokens: CoinBalance[]) {
  return tokens
    .filter((token) => Number(token.totalBalance) > 0)
    .sort((a, b) =>
      (Coin.getCoinSymbol(a.coinType) + Number(a.totalBalance)).localeCompare(
        Coin.getCoinSymbol(b.coinType) + Number(b.totalBalance),
      ),
    );
}
