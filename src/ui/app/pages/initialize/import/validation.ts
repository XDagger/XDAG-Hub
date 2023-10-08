import * as Yup from "yup";
import { normalizeMnemonics, validateMnemonics } from "_src/xdag/typescript/cryptography";

export const mnemonicValidation = Yup.array()
  .of(Yup.string().ensure().trim())
  .transform((mnemonic: string[]) =>
    normalizeMnemonics(mnemonic.join(" ")).split(" "),
  )
  .test("mnemonic-valid", "Recovery Passphrase is invalid", (mnemonic) => {
    return validateMnemonics(mnemonic?.join(" ") || "");
  })
  .label("Recovery Passphrase");
