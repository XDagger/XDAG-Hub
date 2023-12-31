import { Form, Formik } from "formik";
import { object } from "yup";
import { Button } from "_app/shared/ButtonUI";
import { ArrowLeft16 } from "_assets/icons/tsIcons";
import PasswordFields from "_pages/initialize/shared/password-fields";
import { passwordFieldsValidation } from "_pages/initialize/shared/password-fields/validation";
import type { StepProps } from ".";
import { useTranslation } from "react-i18next";

const validationSchema = object( passwordFieldsValidation );

export default function StepTwo( { next, data, mode }: StepProps ) {

	const { t } = useTranslation();

	return (
		<Formik
			initialValues={ data }
			validationSchema={ validationSchema }
			validateOnMount={ true }
			onSubmit={ async ( values ) => {await next( values, 1 );} }
			enableReinitialize={ true }
		>
			{ ( { isSubmitting, isValid, values } ) => (
				<Form className="flex flex-col flex-nowrap self-stretch flex-1">
					<PasswordFields/>
					<div className="flex-1"/>
					<div className="flex flex-nowrap gap-2.5 mt-5">
						<Button
							type="button"
							disabled={ isSubmitting }
							size="tall"
							variant="outline"
							onClick={ () => next( values, -1 ) }
							before={ <ArrowLeft16/> }
							text={ t( "StepTwo.Back" ) }
						/>
						<Button
							type="submit"
							disabled={ isSubmitting || !isValid }
							size="tall"
							variant="primary"
							loading={ isSubmitting }
							text={ mode === "import" ? t( "StepTwo.Import" ) : t( "StepTwo.Reset" ) }
						/>
					</div>
				</Form>
			) }
		</Formik>
	);
}
