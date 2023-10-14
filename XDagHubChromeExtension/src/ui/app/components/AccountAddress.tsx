import { useActiveAddress } from "../hooks/useActiveAddress";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { Text } from "../shared/text";
import { Copy12 } from "_assets/icons/tsIcons";
import { formatAddress } from "_src/xdag/typescript/utils";
import type { XDagAddress } from "_src/xdag/typescript/types";
import { useTranslation } from "react-i18next";

type AccountAddressProps = {
	copyable?: boolean;
	address?: XDagAddress;
};

export function AccountAddress( { copyable, address }: AccountAddressProps ) {
	const activeAddress = useActiveAddress();
	const addressToShow = address || activeAddress;
	const { t } = useTranslation();
	const copyCallback = useCopyToClipboard( addressToShow || "", {
		copySuccessMessage: t( "AccountAddress.AddressCopied" ),
	} );

	return addressToShow ? (
		<div className="flex flex-nowrap flex-row items-center gap-1">
			<Text variant="bodySmall" weight="medium" color="xdag-dark" mono>
				{ formatAddress( addressToShow ) }
			</Text>
			{ copyable ? (
				<Copy12 className="text-steel cursor-pointer" onClick={ copyCallback }/>
			) : null }
		</div>
	) : null;
}
