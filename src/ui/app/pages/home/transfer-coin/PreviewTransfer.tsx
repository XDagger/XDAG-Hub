import { Text } from "_app/shared/text";
import { TxnAddress } from "_components/receipt-card/TxnAddress";
import { TxnAmount } from "_components/receipt-card/TxnAmount";
import { parseAmount } from "_helpers";
import { useCoinMetadata } from "_shared/hooks";
import { useActiveAddress } from "_src/ui/app/hooks/useActiveAddress";
import { GAS_SYMBOL } from "_src/xdag/typescript/framework";
import { TxnRemark } from "_components/receipt-card/TxnRemark";
import { useTranslation } from "react-i18next";

export type PreviewTransferProps = {
	coinType: string;
	to: string;
	amount: string;
	approximation?: boolean;
	gasBudget?: string;
	remark?: string
};

export function PreviewTransfer( { coinType, to, amount, approximation, gasBudget, remark }: PreviewTransferProps ) {
	const accountAddress = useActiveAddress();
	const { data: metadata } = useCoinMetadata( coinType );
	const amountWithoutDecimals = parseAmount( amount, metadata?.decimals ?? 0 );
	const { t } = useTranslation()

	return (
		<div className="divide-y divide-solid divide-steel/20 divide-x-0 flex flex-col px-2.5 w-full">
			<TxnAmount
				amount={ amountWithoutDecimals.toString() }
				label={ t( "PreviewTransfer.Sending" ) }
				coinType={ coinType }
				approximation={ approximation }
			/>
			<TxnAddress address={ accountAddress || "" } label={ t( "PreviewTransfer.From" ) }/>
			<TxnAddress address={ to } label={ t( "PreviewTransfer.To" ) }/>
			<TxnRemark remark={ remark ?? "" } label={ t( "PreviewTransfer.Remark" ) }/>
			<div className="pt-3.5 mb-5 flex w-full gap-2 justify-between">
				<div className="flex gap-1">
					<Text variant="body" color="gray-80" weight="medium">
						{ t( "PreviewTransfer.EstimatedGasFees" ) }
					</Text>
				</div>
				<Text variant="body" color="gray-90" weight="medium">
					{ gasBudget } { GAS_SYMBOL }
				</Text>
			</div>
		</div>
	);
}
