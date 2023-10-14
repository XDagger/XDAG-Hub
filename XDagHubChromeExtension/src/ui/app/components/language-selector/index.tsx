import { Popover, Transition } from "@headlessui/react";
import { ChevronDown12 } from "_assets/icons/tsIcons";
import { useTranslation } from "react-i18next";
import { setActiveLanguage, supportLanguages } from "_app/i18n/config";
import { useActiveLanguage } from "_app/hooks/useActiveLanguage";
import { Text } from "_app/shared/text";
import { ButtonConnectedTo } from "_app/shared/ButtonConnectedTo";
import { LanguageList } from "_components/language-selector/LanguageList";
import Browser from "webextension-polyfill";


export function LanguageSelector() {

	const allLanguages = Object.keys( supportLanguages );
	const activeLanguage = useActiveLanguage();
	const { t } = useTranslation();

	if ( !allLanguages.length ) {
		return null;
	}

	const getLanguageText = ( language: string ) => {
		if ( language === 'follow' ) {
			return t( "LanguageConfig.followSystem" );
		}
		return supportLanguages[ language ];
	}

	const buttonText = (
		<Text mono variant="bodySmall" truncate>
			{ getLanguageText( activeLanguage ) }
		</Text>
	);

	if ( allLanguages.length === 1 ) {
		return (
			<ButtonConnectedTo
				text={ buttonText }
				onClick={ undefined }
				iconAfter={ null }
				bgOnHover="grey"
			/>
		);
	}


	return (
		<Popover className="relative z-10 max-w-full px-5 mt-0">
			{ ( { close } ) => (
				<>
					<Popover.Button
						as={ ButtonConnectedTo }
						text={ buttonText }
						iconAfter={ <ChevronDown12/> }
						bgOnHover="grey"
					/>
					<Transition
						enter="transition duration-200 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-200 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-75 opacity-0"
					>
						<Popover.Panel className="absolute left-1/2 -translate-x-1/2 w-[280px] drop-shadow-accountModal mt-2 z-0 rounded-md bg-white">
							<div className="absolute w-3 h-3 bg-white -top-1 left-1/2 -translate-x-1/2 rotate-45"/>
							<div className="relative px-1.25 max-h-80 overflow-y-auto max-w-full z-10">
								<LanguageList
									onLanguageSelected={ async ( language ) => {
										if ( language !== activeLanguage ) {
											setActiveLanguage(language);
										}
									} }
								/>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			) }
		</Popover>
	);
}
