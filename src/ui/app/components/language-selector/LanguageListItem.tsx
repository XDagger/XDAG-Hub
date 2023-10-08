
import { Check12 } from "_assets/icons/tsIcons";
import { useActiveLanguage } from "_app/hooks/useActiveLanguage";
import { Text } from "_app/shared/text";
import { supportLanguages } from "_app/i18n/config";
import { useTranslation } from "react-i18next";

export type LanguageItemProps = {
	language: string;
	onLanguageSelected: ( laguage: string ) => void;
};

export function LanguageListItem( { language, onLanguageSelected, }: LanguageItemProps ) {

	const activeLanguage = useActiveLanguage();
	const { t } = useTranslation();

	const getLanguageText = ( language: string ) => {
		if ( language === 'follow' ) {
			return t( "LanguageConfig.followSystem" );
		}
		return supportLanguages[ language ];
	}


	return (
		<li>
			<button
				className="appearance-none bg-transparent border-0 w-full flex p-2.5 items-center gap-2.5 rounded-md hover:bg-Xdag/10 cursor-pointer focus-visible:ring-1 group transition-colors text-left"
				onClick={ () => {
					onLanguageSelected( language );
				} }
			>
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<div className="min-w-0">
						<Text color="steel-darker" variant="bodySmall" truncate mono>
							{ getLanguageText(language) }
						</Text>
					</div>
				</div>
				{ activeLanguage === language ? (
					<Check12 className="text-success"/>
				) : null }
			</button>
		</li>
	);
}
