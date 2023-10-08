import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { PreviewTransfer } from "./PreviewTransfer";
import { SendTokenForm } from "./SendTokenForm";
import { createTokenTransferTransactionBlock } from "./utils/transaction";
import { Button } from "_app/shared/ButtonUI";
import BottomMenuLayout, { Content, Menu, } from "_app/shared/bottom-menu-layout";
import { ArrowRight16, ArrowLeft16 } from "_assets/icons/tsIcons";
import { ActiveCoinsCard } from "_components/active-coins-card";
import Overlay from "_components/overlay";
import { useCoinMetadata } from "_shared/hooks";
import { getSignerOperationErrorMessage } from "_src/ui/app/helpers/errorMessages";
import { useSigner } from "_src/ui/app/hooks";
import { useActiveAddress } from "_src/ui/app/hooks/useActiveAddress";
import { getTransactionDigest } from "_src/xdag/typescript/types";
import type { SubmitProps } from "./SendTokenForm";
import { useTranslation } from "react-i18next";


function TransferCoinPage() {
	const [ searchParams ] = useSearchParams();
	const coinType = searchParams.get( "type" );
	const [ showTransactionPreview, setShowTransactionPreview ] = useState<boolean>( false );
	const [ formData, setFormData ] = useState<SubmitProps>();
	const navigate = useNavigate();
	const { data: coinMetadata } = useCoinMetadata( coinType );
	const signer = useSigner();
	const address = useActiveAddress();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	// const { clientIdentifier, notificationModal } = useQredoTransaction();

	const transactionBlock = useMemo( () => {
		if ( !coinType || !signer || !formData || !address ) {
			return null;
		}
		return createTokenTransferTransactionBlock( {
			coinType,
			coinDecimals: coinMetadata?.decimals ?? 0,
			...formData,
		} );
	}, [ formData, signer, coinType, address, coinMetadata?.decimals ] );

	const executeTransfer = useMutation( {
		mutationFn: async () => {
			if ( !transactionBlock || !signer ) {
				throw new Error( "Missing data" );
			}
			try {
				// use BackgroundServiceSigner ,prepare
				let res = signer.signAndExecuteTransactionBlockByType( transactionBlock, "transfer" );
				return res
			} catch ( error ) {
				throw error;
			}
		},
		onSuccess: ( response ) => {
			queryClient.invalidateQueries( [ "coin-balance" ] );
			const receiptUrl = `/receipt?blockAddress=${ encodeURIComponent( getTransactionDigest( response ), ) }&from=transactions`;
			return navigate( receiptUrl );
		},
		onError: ( error ) => {
			toast.error(
				<div className="max-w-xs overflow-hidden flex flex-col">
					<small className="text-ellipsis overflow-hidden">
						{ getSignerOperationErrorMessage( error ) }
					</small>
				</div>,
			);
		},
	} );

	if ( !coinType ) {
		return <Navigate to="/" replace={ true }/>;
	}


	return (
		<Overlay
			showModal={ true }
			title={ showTransactionPreview ? t( "TransferCoinPage.ReviewSend" ) : t( "TransferCoinPage.SendCoins" ) }
			closeOverlay={ () => navigate( "/" ) }
		>
			<div className="flex flex-col w-full mt-2.5">

				{ showTransactionPreview && formData ? (
					<BottomMenuLayout>
						<Content>
							<PreviewTransfer
								coinType={ coinType }
								amount={ formData.amount }
								to={ formData.to }
								approximation={ formData.isPayAllXDag }
								gasBudget={ formData.gasBudgetEst }
								remark={ formData.remark }
							/>
						</Content>
						<Menu stuckClass="sendCoin-cta" className="w-full px-0 pb-0 mx-0 gap-2.5">
							<Button
								type="button"
								variant="secondary"
								onClick={ () => setShowTransactionPreview( false ) }
								text={ t( "TransferCoinPage.Back" ) }
								before={ <ArrowLeft16/> }
							/>
							<Button
								type="button"
								variant="primary"
								onClick={ () => executeTransfer.mutateAsync() }
								text={ t( "TransferCoinPage.SendNow" ) }
								disabled={ coinType === null }
								after={ <ArrowRight16/> }
								loading={ executeTransfer.isLoading }
							/>
						</Menu>
					</BottomMenuLayout>
				) : (
					<>
						<div className="mb-2 flex flex-col gap-1">
							{/*<div className="pl-1.5">*/ }
							{/*	<Text variant="caption" color="steel" weight="semibold">*/ }
							{/*		Select all Coins*/ }
							{/*	</Text>*/ }
							{/*</div>*/ }
							<ActiveCoinsCard activeCoinType={ coinType }/>
						</div>

						<SendTokenForm
							onSubmit={ ( formData ) => {
								setShowTransactionPreview( true );
								setFormData( formData );
							} }
							coinType={ coinType }
							initialAmount={ formData?.amount || "" }
							initialTo={ formData?.to || "" }
							initialRemark={ formData?.remark ?? "" }
						/>
					</>
				) }
			</div>
			{/*{notificationModal}*/ }
		</Overlay>
	);
}

export default TransferCoinPage;
