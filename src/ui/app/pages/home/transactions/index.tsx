import cl from "classnames";
import { Navigate, useParams } from "react-router-dom";
import { CompletedTransactions } from "./CompletedTransactions";
import FiltersPortal from "_components/filters-tags";
import { AccountType } from "_src/background/keyring/Account";
import { useActiveAccount } from "_src/ui/app/hooks/useActiveAccount";
import PageTitle from "_src/ui/app/shared/PageTitle";
import { PendingTransaction } from "_pages/home/transactions/PendingTransaction";
import { useTranslation } from "react-i18next";

function TransactionBlocksPage() {
	const activeAccount = useActiveAccount();
	const { status } = useParams();
	const { t } = useTranslation();
	const isPendingTransactions = status === "pending";
	if ( activeAccount && isPendingTransactions ) {
		return <Navigate to="/transactions" replace/>;
	}

	return (
		<div className="flex flex-col flex-nowrap h-full overflow-x-visible">
			<PageTitle title={ t( "TransactionBlocksPage.YourTransactions" ) }/>
			<div className={ cl( "mt-5 flex-grow overflow-y-auto px-5 -mx-5 divide-y divide-solid divide-gray-45 divide-x-0" ) }>
				<PendingTransaction></PendingTransaction>
				<CompletedTransactions/>
			</div>
		</div>
	);
}

export default TransactionBlocksPage;
