import BigNumber from "bignumber.js";
import * as Yup from "yup";
import { formatBalance } from "_shared/hooks";

export function createTokenValidation(
  coinBalance: BigNumber,
  coinSymbol: string,
  decimals: number,
) {
  return Yup.mixed()
    .transform((_, original) => {return new BigNumber(original);})
    .test("required", `\${path} is a required field`, (value) => {return !!value;})
    .test("valid", "The value provided is not valid.", (value?: BigNumber) => {
      if (!value || value.isNaN() || !value.isFinite()) {
        return false;
      }
      return true;
    })
    .test(
      "min",
      `\${path} must be greater than 0 ${coinSymbol}`,
      (amount?: BigNumber) => (amount ? amount.gt(0) : false),
    )
    .test(
      "max",
      `\${path} must be less than ${formatBalance( BigNumber(coinBalance.toString()), decimals, )} ${coinSymbol}`,
      (amount?: BigNumber) => {
        return amount ? amount<=coinBalance : false
      },
    )
    .test(
      "max-decimals",
      `The value exceeds the maximum decimals (${decimals}).`,
      (amount?: BigNumber) => {
        return amount ? amount.shiftedBy(decimals).isInteger() : false;
      },
    )
    .label("Amount");
}
