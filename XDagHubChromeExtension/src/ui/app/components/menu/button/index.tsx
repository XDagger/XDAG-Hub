import { memo } from "react";
import { LanguageSelector } from "_components/language-selector";
import SettingButton from "_components/menu/button/SettingButton";

export type MenuButtonProps = {
	showSetting?: boolean;
};

function MenuButton( { showSetting }: MenuButtonProps ) {
	return (
		<div className="flex flex-row">
			<LanguageSelector></LanguageSelector>
			{ showSetting && <SettingButton></SettingButton> }
		</div>
	);
}

export default memo( MenuButton );
