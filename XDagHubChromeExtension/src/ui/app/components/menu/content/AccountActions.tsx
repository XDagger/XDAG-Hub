import { type ReactNode } from "react";
import { BadgeLabel } from "../../BadgeLabel";
import { useNextMenuUrl } from "../hooks";
import {
	AccountType,
	type SerializedAccount,
} from "_src/background/keyring/Account";
import { Link } from "_src/ui/app/shared/Link";
import { useTranslation } from "react-i18next";

export type AccountActionsProps = {
	account: SerializedAccount;
};

export function AccountActions( { account }: AccountActionsProps ) {
	const exportAccountUrl = useNextMenuUrl( true, `/export/${ account.address }` );
	const recoveryPassphraseUrl = useNextMenuUrl( true, "/recovery-passphrase" );
	const { t } = useTranslation()

	let actionContent: ReactNode | null = null;
	switch ( account.type ) {
		case AccountType.IMPORTED:
			actionContent = (
				<div>
					<Link
						text="Export Private Key"
						to={ exportAccountUrl }
						color="heroDark"
						weight="medium"
					/>
				</div>
			);
			break;
		case AccountType.DERIVED:
			actionContent = (
				<>
					<div>
						<Link
							text={ t( "AccountActions.ExportPrivateKey" ) }
							to={ exportAccountUrl }
							color="heroDark"
							weight="medium"
						/>
					</div>
					<div>
						<Link
							to={ recoveryPassphraseUrl }
							color="heroDark"
							weight="medium"
							text={ t( "AccountActions.ExportPassphrase" ) }
						/>
					</div>
				</>
			);
			break;
		default:
			throw new Error( `Encountered unknown account type` );
	}

	return (
		<div className="flex items-center flex-1 gap-4 pb-1 overflow-x-auto">
			{ actionContent }
		</div>
	);
}
