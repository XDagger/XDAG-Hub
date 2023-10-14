import {
  passwordValidation,
  getConfirmPasswordValidation,
} from "_app/shared/input/password/validation";

export const passwordFieldsValidation = {
  password: passwordValidation,
  confirmPassword: getConfirmPasswordValidation("password"),
};
