import * as Yup from "yup";
import { createXDagAddressValidation } from "_components/address-input/validation";
import { createTokenValidation } from "_src/shared/validation";
import { type JsonRpcProvider } from "_src/xdag/typescript/rpc";

export function createValidationSchemaStepOne( rpc: JsonRpcProvider, XDagNSEnabled: boolean, ...args: Parameters<typeof createTokenValidation> ) {

  return Yup.object({
    to: createXDagAddressValidation(),
    amount: createTokenValidation(...args),
  });
}
