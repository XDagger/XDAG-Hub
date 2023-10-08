const COIN_TYPE = "0x2::coin::Coin";

export const GAS_TYPE_ARG = "0x2::Xdag::XDAG";
export const GAS_SYMBOL = "XDAG";

export class Coin {
  public static getCoinTypeFromArg(coinTypeArg: string) {
    return `${COIN_TYPE}<${coinTypeArg}>`;
  }
}
