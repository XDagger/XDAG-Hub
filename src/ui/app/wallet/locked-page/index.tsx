import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import Browser from "webextension-polyfill";
import * as Yup from "yup";
import Alert from "_app/components/alert";
import { Button } from "_app/shared/ButtonUI";
import { CardLayout } from "_app/shared/card-layout";
import FieldLabel from "_app/shared/field-label";
import { PasswordInputField } from "_app/shared/input/password";
import PageMainLayout from "_app/shared/page-main-layout";
import { unlockWallet } from "_app/wallet/actions";
import { devQuickUnlockEnabled } from "_app/wallet/constants";
import { useLockedGuard } from "_app/wallet/hooks";
import { LockUnlocked16 } from "_assets/icons/tsIcons";
import Loading from "_components/loading";
import { useAppDispatch, useInitializedGuard } from "_hooks";
import PageLayout from "_pages/layout";
import st from "./LockedPage.module.scss";
import { useTranslation } from 'react-i18next';

let passValidation = Yup.string().ensure();
if ( !devQuickUnlockEnabled ) {
	passValidation = passValidation.required( "Required" );
}
const validation = Yup.object( {
	password: passValidation,
} );

// this is only for dev do not use in prod
async function devLoadPassFromStorage(): Promise<string | null> {
	return (await Browser.storage.local.get( { "**dev**": { pass: null } } ))[
		"**dev**"
		][ "pass" ];
}

export default function LockedPage() {
	const initGuardLoading = useInitializedGuard( true );
	const lockedGuardLoading = useLockedGuard( true );
	const guardsLoading = initGuardLoading || lockedGuardLoading;
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	return (
		<Loading loading={ guardsLoading }>
			<PageLayout>
				<PageMainLayout className={ st.main }>
					<CardLayout
						icon="Xdag"
						headerCaption={ t( "lockedPage.headerCaption" ) }
						title={ t( "lockedPage.title" ) }
					>
						<Formik
							initialValues={ { password: "" } }
							validationSchema={ validation }
							validateOnMount={ true }
							onSubmit={ async ( { password }, { setFieldError } ) => {
								if ( devQuickUnlockEnabled && password === "" ) {
									password = (await devLoadPassFromStorage()) || "";
								}
								try {
									await dispatch( unlockWallet( { password } ) ).unwrap();
								} catch ( e ) {
									setFieldError( "password", (e as Error).message === "Incorrect password" ? t( "lockedPage.incorrectPassword" ) : (e as Error).message );
								}
							} }
						>
							{ ( { touched, errors, isSubmitting, isValid } ) => (
								<Form className={ st.form }>
									<FieldLabel txt={ t( "lockedPage.enterPassword" ) }>
										<PasswordInputField
											name="password"
											disabled={ isSubmitting }
											autoFocus
										/>
										{ touched.password && errors.password ? (
											<Alert>{ errors.password }</Alert>
										) : null }
									</FieldLabel>
									<div className={ st.fill }/>
									<Button
										type="submit"
										disabled={ isSubmitting || !isValid }
										variant="primary"
										size="tall"
										before={ <LockUnlocked16/> }
										text={ t( 'lockedPage.unlockWallet' ) }
									/>
									<Link to="/forgot-password" className={ st.forgotLink }>
										{/*Forgot password?*/ }
										{ t( 'lockedPage.forgotPassword' ) }
									</Link>
								</Form>
							) }
						</Formik>
					</CardLayout>
				</PageMainLayout>
			</PageLayout>
		</Loading>
	);
}
