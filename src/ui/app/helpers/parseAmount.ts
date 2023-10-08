
import BigNumber from "bignumber.js";

// export function parseAmount(amount: string, coinDecimals: number) {
//   try {
//     return BigInt(
//       new BigNumber(amount).shiftedBy(coinDecimals).integerValue().toString(),
//     );
//   } catch (e) {
//     return BigInt(0);
//   }
// }
export function parseAmount( amount: string, coinDecimals: number ): BigNumber {
	return new BigNumber( amount );
}