import { useFormikContext } from "formik";
import FieldLabel from "_app/shared/field-label";
import { PasswordInputField } from "_app/shared/input/password";
import Alert from "_components/alert";
import { useTranslation } from "react-i18next";

export type PasswordFieldsValues = {
	password: string;
	confirmPassword: string;
};

export default function PasswordFields() {
	const { t } = useTranslation();
	const { touched, errors } = useFormikContext<PasswordFieldsValues>();
	return (
		<>
			<FieldLabel txt={t("PasswordFields.CreatePassword")}>
				<PasswordInputField name="password"/>
				{ touched.password && errors.password ? (
					<Alert>{ errors.password }</Alert>
				) : null }
			</FieldLabel>
			<FieldLabel txt={t("PasswordFields.ConfirmPassword")}>
				<PasswordInputField name="confirmPassword"/>
				{ touched.confirmPassword && errors.confirmPassword ? (
					<Alert>{ errors.confirmPassword }</Alert>
				) : null }
			</FieldLabel>
		</>
	);
}
