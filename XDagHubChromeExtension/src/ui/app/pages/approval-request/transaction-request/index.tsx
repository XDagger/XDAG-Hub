import { useMemo, useState } from "react";
import { GasFees } from "./GasFees";
import { TransactionDetails } from "./TransactionDetails";
import { ConfirmationModal } from "../../../shared/ConfirmationModal";
import { UserApproveContainer } from "_components/user-approve-container";
import {
	useAppDispatch,
	useSigner,
	useTransactionData,
} from "_hooks";
import { type TransactionApprovalRequest } from "_payloads/transactions/ApprovalRequest";
import { respondToTransactionRequest } from "_redux/slices/transaction-requests";
import { useTransactionSummary } from "_shared/hooks";
import { PageMainLayoutTitle } from "_src/ui/app/shared/page-main-layout/PageMainLayoutTitle";
import { TransactionSummary } from "_src/ui/app/shared/transaction-summary";
import { createXDagTransferTransactionBlock } from "_pages/home/transfer-coin/utils/transaction";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type TransactionRequestProps = {
	txRequest: TransactionApprovalRequest;
};

export function TransactionRequest( { txRequest }: TransactionRequestProps ) {

	const addressForTransaction = txRequest.tx.account;
	const signer = useSigner( addressForTransaction );
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const transaction = useMemo( () => {
		// const tx = TransactionBlock.from(txRequest.tx);
		const txBlock = createXDagTransferTransactionBlock( txRequest.tx.toAddress!, txRequest.tx.amount, txRequest.tx.remark );
		if ( addressForTransaction ) {
			txBlock.setSenderIfNotSet( addressForTransaction );
		}
		return txBlock;
	}, [ txRequest.tx, addressForTransaction ] );

	const { isLoading, isError } = useTransactionData( addressForTransaction, transaction, );
	const [ isConfirmationVisible, setConfirmationVisible ] = useState( false );
	const summary = useTransactionSummary( { transaction: undefined, currentAddress: addressForTransaction, } );

	if ( !signer ) {
		return null;
	}

	return (
		<>
			<UserApproveContainer
				origin={ txRequest.origin }
				originFavIcon={ txRequest.originFavIcon }
				approveTitle={ t( "TransactionRequest.Approve" ) }
				rejectTitle={ t( "TransactionRequest.Reject" ) }
				onSubmit={ async ( approved: boolean ) => {
					if ( isLoading ) {
						return;
					}
					if ( approved ) {
						setConfirmationVisible( true );
						return;
					}
					await dispatch(
						respondToTransactionRequest( {
							approved,
							txRequestID: txRequest.id,
							signer,
							// clientIdentifier,
						} ),
					);
				} }
				address={ addressForTransaction }
				approveLoading={ isLoading || isConfirmationVisible }
			>
				<PageMainLayoutTitle title={ t( "TransactionRequest.ApproveTransaction" ) }/>

				<div className="flex flex-col gap-4">
					<TransactionSummary
						isDryRun
						// isLoading={isDryRunLoading}
						// isError={isDryRunError}
						isLoading={ true }
						isError={ true }
						showGasSummary={ false }
						summary={ summary }
					/>
				</div>
				<section className="flex flex-col gap-4">
					<GasFees sender={ addressForTransaction } transaction={ transaction }/>
					<TransactionDetails
						sender={ addressForTransaction }
						transaction={ transaction }
					/>
				</section>
			</UserApproveContainer>
			<ConfirmationModal
				isOpen={ isConfirmationVisible }
				title={ t( "TransactionRequest.MightFailWarning" ) }
				hint={ t( "TransactionRequest.ChargedGasFeeWarning" ) }
				confirmStyle="primary"
				confirmText={ t( "TransactionRequest.Approve" ) }
				cancelText={ t( "TransactionRequest.Reject" ) }
				cancelStyle="warning"
				onResponse={ async ( isConfirmed ) => {
					const result = await dispatch( respondToTransactionRequest( {
							approved: isConfirmed, txRequestID: txRequest.id, signer,
							// clientIdentifier,
						} ),
					);
					const txAddress = (result as any)?.payload?.txResponse?.address;
					const receiptUrl = `/receipt?blockAddress=${ encodeURIComponent( txAddress ) }&from=transactions`;
					setConfirmationVisible( false );

					return navigate( receiptUrl );
				}
				}
			/>
			{/*{notificationModal}*/ }
		</>
	);
}
