import { DescriptionItem, DescriptionList } from "./DescriptionList";
import { SummaryCard } from "./SummaryCard";
import { useTransactionData, useTransactionGasBudget } from "_src/ui/app/hooks";
import { type TransactionBlock } from "_src/xdag/typescript/builder";
import { formatAddress } from "_src/xdag/typescript/utils";
import type { XDagAddress } from "_src/xdag/typescript/types";
import { GAS_SYMBOL } from "_src/xdag/typescript/framework";
import { useTranslation } from "react-i18next";

interface Props
{
	sender?: XDagAddress;
	transaction: TransactionBlock;
}

export function GasFees( { sender, transaction }: Props ) {
	const { data: transactionData } = useTransactionData( sender, transaction );
	const { t } = useTranslation();
	const {
		data: gasBudget,
		isLoading,
		isError,
	} = useTransactionGasBudget( sender, transaction );
	const isSponsored =
		transactionData?.gasConfig.owner &&
		transactionData.sender !== transactionData.gasConfig.owner;
	return (
		<SummaryCard
			header={ t( "GasFees.EstimatedGasFees" ) }
			badge={
				isSponsored ? (
					<div className="bg-white text-success px-1.5 py-0.5 text-captionSmallExtra rounded-full font-medium uppercase">
						{ t( "GasFees.Sponsored" ) }
					</div>
				) : null
			}
			initialExpanded
		>
			<DescriptionList>
				<DescriptionItem title={ t( "GasFees.YouPay" ) }>
					{ isLoading
						? t( "GasFees.Estimating" )
						: isError
							? t( "GasFees.GasEstimationFailed" )
							: `${ isSponsored ? 0 : gasBudget } ${ GAS_SYMBOL }` }
				</DescriptionItem>
				{ isSponsored && (
					<>
						<DescriptionItem title="Sponsor Pays">
							{ gasBudget ? `${ gasBudget } ${ GAS_SYMBOL }` : "-" }
						</DescriptionItem>
						<DescriptionItem title="Sponsor">
							{ formatAddress( transactionData!.gasConfig.owner! ) }
						</DescriptionItem>
					</>
				) }
			</DescriptionList>
		</SummaryCard>
	);
}
