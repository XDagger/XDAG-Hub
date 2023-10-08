import { memo } from "react";
import { LanguageSelector } from "_components/language-selector";

export type MenuButtonProps = {
	className?: string;
};

function LanguageButton( { className }: MenuButtonProps ) {
	return (
		<LanguageSelector></LanguageSelector>
	);
}

export default memo( LanguageButton );
