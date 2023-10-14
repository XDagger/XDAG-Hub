import { nullable, number, object, string } from "superstruct";
import { ObjectId } from "../types/common.js";
import type { CoinStruct } from "../types/coin.js";
import type { Infer } from "superstruct";
import BigNumber from "bignumber.js";
export const XDAG_SYSTEM_ADDRESS = "0x3";
export const XDAG_FRAMEWORK_ADDRESS = "0x2";
export const XDAG_TYPE_ARG = `0x2::Xdag::XDAG`;
export const GAS_TYPE_ARG = "0x2::xdag::XDAG";
export const GAS_SYMBOL = "XDAG";

export const CoinMetadataStruct = object({
  decimals: number(),
  name: string(),
  symbol: string(),
  description: string(),
  iconUrl: nullable(string()),
  id: nullable(ObjectId),
});
export type CoinMetadata = Infer<typeof CoinMetadataStruct>;

export class Coin {

  static getCoinSymbol(coinTypeArg: string) {
    return coinTypeArg.substring(coinTypeArg.lastIndexOf(":") + 1);
  }

  static totalBalance(coins: CoinStruct[]): BigNumber {
    let total =  coins.reduce( (partialSum, c) => partialSum.plus(Coin.getBalanceFromCoinStruct(c)), BigNumber(0), );
    return total;
  }

  static getBalanceFromCoinStruct(coin: CoinStruct): BigNumber {
    return BigNumber(coin.balance);
  }

}

