import Alert from "_components/alert";
import { ErrorBoundary } from "_components/error-boundary";
import Loading from "_components/loading";
import { TransactionCard } from "_components/transactions-card";
import { NoActivityCard } from "_components/transactions-card/NoActivityCard";
import { useActiveAddress } from "_src/ui/app/hooks/useActiveAddress";
import { useQueryTransactionsByAddress } from "_app/hooks/useQueryTransactionsByAddress";
import { useTranslation } from "react-i18next";

export function CompletedTransactions() {
	const activeAddress = useActiveAddress();
	const { t } = useTranslation()
	const {
		data,
		isLoading,
		error,
	} = useQueryTransactionsByAddress( activeAddress );
	if ( error ) {
		return <Alert>{ (error as Error)?.message }</Alert>;
	}
	return (
		<Loading loading={ isLoading }>
			{ data?.transactions?.length && activeAddress ? (
				data?.transactions.map( ( txn ) => (
					<ErrorBoundary key={ txn.hashlow }>
						<TransactionCard txn={ txn } address={ activeAddress }/>
					</ErrorBoundary>
				) )
			) : (
				<NoActivityCard message={t("CompletedTransactions.transactionsWillShowHere")}/>
			) }
		</Loading>
	);
}
