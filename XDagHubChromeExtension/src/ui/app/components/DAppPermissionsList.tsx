import { Text } from "../shared/text";
import { CheckFill12 } from "_assets/icons/tsIcons";
import type { PermissionType } from "_messages/payloads/permissions";
import { useTranslation } from "react-i18next";

export type DAppPermissionsListProps = {
	permissions: PermissionType[];
};

const permissionTypeToTxt: Record<PermissionType, string> = {
	viewAccount: "DAppPermissionsList.ShareWalletAddress",
	suggestTransactions: "DAppPermissionsList.SuggestTransactionsToApprove",
};

export function DAppPermissionsList( { permissions }: DAppPermissionsListProps ) {
	const { t } = useTranslation();

	return (
		<ul className="list-none m-0 p-0 flex flex-col gap-3">
			{ permissions.map( ( aPermission ) => (
				<li
					key={ aPermission }
					className="flex flex-row flex-nowrap items-center gap-2"
				>
					<CheckFill12 className="text-steel"/>
					<Text variant="bodySmall" weight="medium" color="steel-darker">
						{ t( permissionTypeToTxt[ aPermission ] ) }
					</Text>
				</li>
			) ) }
		</ul>
	);
}
