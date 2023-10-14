import cl from "classnames";
import { memo } from "react";
import { Link } from "react-router-dom";

import { useMenuIsOpen, useNextMenuUrl } from "_components/menu/hooks";

import st from "./SettingButton.module.scss";

export type SettingButtonProps = {
	className?: string;
};

function SettingButton( { className }: SettingButtonProps ) {
	const isOpen = useMenuIsOpen();
	const menuUrl = useNextMenuUrl( !isOpen, "/" );
	return (
		<div className="mt-1.5">
			<Link data-testid="menu" className={ cl( st.button, { [ st.open ]: isOpen }, className ) } to={ menuUrl }>
				<span className={ cl( st.line, st.line1 ) }/>
				<span className={ cl( st.line, st.line2 ) }/>
				<span className={ cl( st.line, st.line3 ) }/>
			</Link>
		</div>
	);
}

export default memo( SettingButton );
