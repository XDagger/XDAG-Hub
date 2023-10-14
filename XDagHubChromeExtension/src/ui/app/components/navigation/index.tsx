import cl from "classnames";
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Activity32, Apps32, Nft132, Tokens32 } from "_assets/icons/tsIcons";
import { useAppSelector } from "_hooks";
import { getNavIsVisible } from "_redux/slices/app";
import st from "./Navigation.module.scss";
import { useTranslation } from "react-i18next";

function makeLinkCls( { isActive }: { isActive: boolean } ) {
	return cl( st.link, { [ st.active ]: isActive } );
}

export type NavigationProps = {
	className?: string;
};

function Navigation( { className }: NavigationProps ) {

	const isVisible = useAppSelector( getNavIsVisible );
	const { t } = useTranslation();

	return (
		<nav className={ cl( "border-b-0 rounded-tl-md rounded-tr-md pt-2 pb-0", st.container, className, { [ st.hidden ]: !isVisible, }, ) }>
			<div id="xdag-apps-filters" className="flex overflow-x:hidden whitespace-nowrap w-full justify-center"></div>
			<div className={ st.navMenu }>
				<NavLink
					data-testid="nav-tokens"
					to="./tokens"
					className={ makeLinkCls }
					title={t("Navigation.Tokens")}
				>
					<Tokens32 className="w-8 h-8"/>
					<span className={ st.title }>{t("Navigation.Coins")}</span>
				</NavLink>
				<NavLink to="./nfts" className={ makeLinkCls } title="NFTs">
					<Nft132 className="w-8 h-8"/>
					<span className={ st.title }>{t("Navigation.Assets")}</span>
				</NavLink>
				<NavLink to="./apps" className={ makeLinkCls } title="Apps">
					<Apps32 className="w-8 h-8"/>
					<span className={ st.title }>{t("Navigation.Apps")}</span>
				</NavLink>
				<NavLink
					data-testid="nav-activity"
					to="./transactions"
					className={ makeLinkCls }
					title="Transactions"
				>
					<Activity32 className="w-8 h-8"/>
					<span className={ st.title }>{t("Navigation.Transactions")}</span>
				</NavLink>
			</div>
		</nav>
	);
}

export default memo( Navigation );
