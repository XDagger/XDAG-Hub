import { AccountBadge } from "./AccountBadge";
import { useActiveAddress } from "../hooks/useActiveAddress";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { Text } from "../shared/text";
import { Check12, Copy12 } from "_assets/icons/tsIcons";
import { type SerializedAccount } from "_src/background/keyring/Account";
import { formatAddress } from "_src/xdag/typescript/utils";
import { useTranslation } from "react-i18next";

export type AccountItemProps = {
	account: SerializedAccount;
	onAccountSelected: ( address: SerializedAccount ) => void;
};

export function AccountListItem( {
																	 account,
																	 onAccountSelected,
																 }: AccountItemProps ) {
	const { address, type } = account;
	const activeAddress = useActiveAddress();
	const { t } = useTranslation()
	const copy = useCopyToClipboard( address, { copySuccessMessage: t( "AccountListItem.AddressCopied" ), } );

	return (
		<li>
			<button
				className="appearance-none bg-transparent border-0 w-full flex p-2.5 items-center gap-2.5 rounded-md hover:bg-Xdag/10 cursor-pointer focus-visible:ring-1 group transition-colors text-left"
				onClick={ () => {
					onAccountSelected( account );
				} }
			>
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<div className="min-w-0">
						<Text color="steel-darker" variant="bodySmall" truncate mono>
							{ formatAddress( address ) }
						</Text>
					</div>
					<AccountBadge accountType={ type }/>
				</div>
				{ activeAddress === address ? (
					<Check12 className="text-success"/>
				) : null }
				<Copy12
					className="text-gray-60 group-hover:text-steel transition-colors hover:!text-hero-dark"
					onClick={ copy }
				/>
			</button>
		</li>
	);
}
