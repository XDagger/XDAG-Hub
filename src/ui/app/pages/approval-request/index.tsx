import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SignMessageRequest } from "./SignMessageRequest";
import { TransactionRequest } from "./transaction-request";
import Loading from "../../components/loading";
import { useAppSelector } from "../../hooks";
import { type RootState } from "../../redux/RootReducer";
import { txRequestsSelectors } from "../../redux/slices/transaction-requests";
import {
	isSignMessageApprovalRequest,
	isTransactionApprovalRequest,
} from "_payloads/transactions/ApprovalRequest";
import { accountsAdapterSelectors } from "_redux/slices/account";

export function ApprovalRequestPage() {
	const { requestID } = useParams();

	const requestSelector = useMemo( () => {
		return ( state: RootState ) => {
			return (requestID && txRequestsSelectors.selectById( state, requestID )) || null;
		}
	}, [ requestID ] );

	const request = useAppSelector( requestSelector );
	const requestsLoading = useAppSelector( ( { transactionRequests } ) => !transactionRequests.initialized, );

	const allReq = useAppSelector(txRequestsSelectors.selectAll);
	useEffect( () => {
		if ( !requestsLoading && (!request || (request && request.approved !== null)) ) {
			console.log('window will close!!!!!!!!!!!!')
			// window.close();
		}
	}, [ requestsLoading, request ] );


	return (
		<Loading loading={ requestsLoading }>
			{ request ? (
				isSignMessageApprovalRequest( request ) ? (
					<SignMessageRequest request={ request }/>
				) : isTransactionApprovalRequest( request ) ? (
					<TransactionRequest txRequest={ request }/>
				) : null
			) : null }
		</Loading>
	);
}
