import { Outlet, useNavigate } from "react-router-dom";
import Browser from "webextension-polyfill";
import { Account } from "./Account";
import { MenuLayout } from "./MenuLayout";
import { LockLocked16 as LockedLockIcon } from "_assets/icons/tsIcons";
import { useNextMenuUrl } from "_components/menu/hooks";
import { AppType } from "_redux/slices/app/AppType";
import { useAppSelector } from "_src/ui/app/hooks";
import { useAccounts } from "_src/ui/app/hooks/useAccounts";
import { useDeriveNextAccountMutation } from "_src/ui/app/hooks/useDeriveNextAccountMutation";
import { Button } from "_src/ui/app/shared/ButtonUI";
import { useTranslation } from "react-i18next";

export function AccountsSettings() {

	const backUrl = useNextMenuUrl( true, "/" );
	const importPrivateKeyUrl = useNextMenuUrl( true, "/import-private-key" );
	const accounts = useAccounts();
	const createAccountMutation = useDeriveNextAccountMutation();
	const { t } = useTranslation();
	// const navigate = useNavigate();
	// const appType = useAppSelector((state) => state.app.appType);
	// const connectLedgerModalUrl = useNextMenuUrl(
	//   true,
	//   "/accounts/connect-ledger-modal",
	// );

	return (
		<MenuLayout title={ t( "AccountsSettings.Accounts" ) } back={ backUrl }>
			<div className="flex flex-col gap-3">
				{ accounts.map( ( account ) => (
					<Account key={ account.address } account={ account }/>
				) ) }
				<Button
					variant="outline"
					size="tall"
					text={ t( "AccountsSettings.CreateNewAccount" ) }
					loading={ createAccountMutation.isLoading }
					onClick={ () => createAccountMutation.mutate() }
				/>
				<Button
					variant="outline"
					size="tall"
					text={ t( "AccountsSettings.ImportPrivateKey" ) }
					to={ importPrivateKeyUrl }
				/>
				{/*<Button*/ }
				{/*  variant="outline"*/ }
				{/*  size="tall"*/ }
				{/*  text="Connect Ledger Wallet"*/ }
				{/*  before={<LockedLockIcon />}*/ }
				{/*  onClick={async () => {*/ }
				{/*    if (appType === AppType.popup) {*/ }
				{/*      const { origin, pathname } = window.location;*/ }
				{/*      await Browser.tabs.create({*/ }
				{/*        url: `${origin}${pathname}#${connectLedgerModalUrl}`,*/ }
				{/*      });*/ }
				{/*      window.close();*/ }
				{/*    } else {*/ }
				{/*      navigate(connectLedgerModalUrl);*/ }
				{/*    }*/ }
				{/*  }}*/ }
				{/*/>*/ }
				<Outlet/>
			</div>
		</MenuLayout>
	);
}
