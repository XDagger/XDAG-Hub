import * as Yup from "yup";
import { passwordFieldsValidation } from "_pages/initialize/shared/password-fields/validation";

export const createMnemonicValidation = Yup.object({
  ...{ terms: Yup.boolean().required().is([true]) },
  ...passwordFieldsValidation,
});
