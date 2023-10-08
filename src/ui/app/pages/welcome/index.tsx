import { Button } from "_app/shared/ButtonUI";
import BottomMenuLayout, { Content } from "_app/shared/bottom-menu-layout";
import { Heading } from "_app/shared/heading";
import { Text } from "_app/shared/text";
import { ArrowRight16, CheckFill16 } from "_assets/icons/tsIcons";
import Loading from "_components/loading";
import Logo from "_components/logo";
import { useInitializedGuard } from "_hooks";
import PageLayout from "_pages/layout";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import { HeaderOnlyLanguage } from "_app/shared/header/HeaderOnlyLanguage";

const VALUE_PROP = [
	"Prop0",
	"Prop1",
	"Prop2",
	"Prop3",
	"Prop4",
	"Prop5",
];

const WelcomePage = () => {
	const checkingInitialized = useInitializedGuard( false );
	const { t } = useTranslation();

	return (
		<PageLayout forceFullscreen={ true }>
			<Loading loading={ checkingInitialized }>
				<div className="flex flex-col flex-nowrap items-center justify-center">
					<div className="rounded-20 bg-xdag-lightest shadow-wallet-content flex flex-col flex-nowrap items-center justify-center w-popup-width h-popup-height">
						<HeaderOnlyLanguage></HeaderOnlyLanguage>
						<BottomMenuLayout>
							<Content className="flex flex-col flex-nowrap items-center p-7.5 pb-0">
								<div className="mt-7.5">
									<Logo/>
								</div>
								<div className="mx-auto mt-7">
									<div className="text-center">
										<Heading variant="heading2" color="gray-90" as="h1" weight="bold">
											{ t( 'WelcomePage.welcomeToXDagWallet' ) }
										</Heading>
										<div className="mt-3">
											<Text variant="pBody" color="steel-dark" weight="medium">
												{ t( 'WelcomePage.ConnectingYouToTheDecentralizedWebAndXDagNetwork' ) }
											</Text>
										</div>
									</div>

									<div className="mt-6 flex gap-2 flex-col">
										{ VALUE_PROP.map( ( value ) => (
											<div key={ value } className="flex gap-2 items-center border bg-xdag-light/40 border-Xdag/30 border-solid rounded-xl px-3 py-2">
												<CheckFill16 className="text-steel flex-none w-4 h-4"/>
												<Text variant="pBody" color="steel-darker" weight="medium">
													{ t( "WelcomePage." + value ) }
												</Text>
											</div>
										) ) }
									</div>
								</div>
							</Content>

							<div className="flex sticky pb-10 m-auto w-[300px] -bottom-px bg-xdag-lightest">
								<Button
									to="/initialize/select"
									size="tall"
									text={ t( 'WelcomePage.GetStarted' ) }
									after={ <ArrowRight16/> }
								/>
							</div>
						</BottomMenuLayout>
					</div>
				</div>
			</Loading>
		</PageLayout>
	);
};

export default WelcomePage;
