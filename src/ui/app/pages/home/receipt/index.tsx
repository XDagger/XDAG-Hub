import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Navigate,
	useSearchParams,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { Check32 } from "_assets/icons/tsIcons";
import Alert from "_components/alert";
import Loading from "_components/loading";
import Overlay from "_components/overlay";
import { ReceiptCard } from "_src/ui/app/components/receipt-card";
import { useActiveAddress } from "_src/ui/app/hooks/useActiveAddress";
import { useRpcClient } from "_src/xdag/api";
import { useTranslation } from "react-i18next";

function ReceiptPage() {
	const location = useLocation();
	const [ searchParams ] = useSearchParams();
	const [ showModal, setShowModal ] = useState( true );
	const activeAddress = useActiveAddress();
	const { t } = useTranslation();

	// get tx results from url params
	const transactionId = searchParams.get( "blockAddress" );
	const fromParam = searchParams.get( "from" );
	const rpc = useRpcClient();

	const { data, isLoading, isError, isRefetching } = useQuery( {
		queryKey: [ "transactions-by-id", transactionId ],
		queryFn: async () => {
			return rpc.getTransactionBlock( { digest: transactionId! } );
		},
		enabled: true,
		retry: 3,
		initialData: location.state?.response,
		refetchInterval: 3500,
	} );

	const navigate = useNavigate();
	// return to previous route or from param if available
	const closeReceipt = useCallback( () => {
		fromParam ? navigate( `/${ fromParam }` ) : navigate( -1 );
	}, [ fromParam, navigate ] );

	// const pageTitle = useMemo( () => {
	// 	if ( data?.state && data.state !== "error" ) {
	// 		return data.state;
	// 	}
	// 	return t( "ReceiptPage.TransactionFailed" );
	// }, [ data ] );

	if ( !transactionId || !activeAddress ) {
		return <Navigate to="/transactions" replace={ true }/>;
	}

	return (
		<Loading loading={ isLoading }>
			<Overlay
				showModal={ showModal }
				setShowModal={ setShowModal }
				title={ t( "ReceiptPage.TransactionStatus" ) }
				closeOverlay={ closeReceipt }
				closeIcon={ <Check32 fill="currentColor" className="text-xdag-light w-8 h-8"/> }
			>
				{ isError ? (
					<div className="mb-2 h-fit">
						<Alert>{ t( "ReceiptPage.SomethingWentWrong" ) }</Alert>
					</div>
				) : null }

				{ data &&
          <ReceiptCard
            txn={ data }
            activeAddress={ activeAddress }
            isRefetching={ isRefetching }
          />
				}
			</Overlay>
		</Loading>
	);
}

export default ReceiptPage;
