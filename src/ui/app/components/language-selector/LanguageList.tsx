import { LanguageListItem, LanguageItemProps } from "./LanguageListItem";
import { supportLanguages } from "_app/i18n/config";
import { useTranslation } from "react-i18next";

export type LanguageListProps = {
	onLanguageSelected: LanguageItemProps["onLanguageSelected"];
};

export function LanguageList( { onLanguageSelected }: LanguageListProps ) {
	const allLanguages = Object.keys( supportLanguages )

	return (
		<ul className="list-none m-0 px-0 py-1.25 flex flex-col items-stretch">
			{ allLanguages.map( ( language ) => (
				<LanguageListItem
					key={ language }
					language={ language }
					onLanguageSelected={ onLanguageSelected }
				/>
			) ) }
		</ul>
	);
}
