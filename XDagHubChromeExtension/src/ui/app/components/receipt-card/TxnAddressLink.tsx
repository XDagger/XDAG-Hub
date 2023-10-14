import ExplorerLink from "_components/explorer-link";
import { ExplorerLinkType } from "_components/explorer-link/ExplorerLinkType";

type TxnAddressLinkProps = {
	address: string;
};

export function TxnAddressLink( { address }: TxnAddressLinkProps ) {
	return (
		<ExplorerLink
			type={ ExplorerLinkType.address }
			address={ address }
			title="View on Xdag Explorer"
			showIcon={ false }
		>
			{ address }
		</ExplorerLink>
	);
}
