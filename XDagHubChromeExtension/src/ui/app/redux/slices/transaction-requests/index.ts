import {createAsyncThunk, createEntityAdapter, createSlice,} from "@reduxjs/toolkit";
import { type WalletSigner } from "_src/ui/app/WalletSigner";
import { getSignerOperationErrorMessage } from "_src/ui/app/helpers/errorMessages";
import {
	type XDagTransactionBlockResponse
} from "_src/xdag/typescript/types";
import {
	type SignedMessage,
	type SignedTransaction
} from "_src/xdag/typescript/signers";
import { fromB64 } from "_src/xdag/bcs";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApprovalRequest } from "_payloads/transactions/ApprovalRequest";
import type { RootState } from "_redux/RootReducer";
import type { AppThunkConfig } from "_store/thunk-extras";
import { createXDagTransferTransactionBlock } from "_pages/home/transfer-coin/utils/transaction";

const txRequestsAdapter = createEntityAdapter<ApprovalRequest>( {
	sortComparer: ( a, b ) => {
		const aDate = new Date( a.createdDate );
		const bDate = new Date( b.createdDate );
		return aDate.getTime() - bDate.getTime();
	},
} );

export const respondToTransactionRequest = createAsyncThunk<
	{ txRequestID: string; approved: boolean; txResponse: XDagTransactionBlockResponse | SignedMessage | undefined; },
	{ txRequestID: string; approved: boolean; signer: WalletSigner; clientIdentifier?: string; },
	AppThunkConfig
>(
	"respond-to-transaction-request",
	async ( { txRequestID, approved, signer, clientIdentifier }, { extra: { background }, getState }, ) => {
		const state = getState();
		const txRequest = txRequestsSelectors.selectById( state, txRequestID );
		if ( !txRequest ) {
			throw new Error( `TransactionRequest ${ txRequestID } not found` );
		}
		let txSigned: SignedTransaction | undefined = undefined;
		let txResult: XDagTransactionBlockResponse | SignedMessage | undefined = undefined;
		let txResultError: string | undefined;
		if ( approved ) {
			try {
				if ( txRequest.tx.type === "sign-message" ) {
					txResult = await signer.signMessage( { message: fromB64( txRequest.tx.message ), }, clientIdentifier, );
				} else if ( txRequest.tx.type === "transaction" ) {
					// const tx = TransactionBlock.from( txRequest.tx );
					const tx = createXDagTransferTransactionBlock( txRequest.tx.account!, txRequest.tx.amount, txRequest.tx.remark );
					if ( txRequest.tx.justSign ) {
						// Just a signing request, do not submit, will not to here.
						txSigned = await signer.signTransactionBlock( { transactionBlock: tx, }, clientIdentifier, );
					} else {
						txResult = await signer.signAndExecuteTransactionBlockByType( tx, "transfer" );
					}
				} else {
					throw new Error( `Unexpected type: ${ (txRequest.tx as any).type }`, );
				}
			} catch ( error ) {
				txResultError = getSignerOperationErrorMessage( error );
			}
		}
		background.sendTransactionRequestResponse( txRequestID, approved, txResult, txResultError, txSigned, );
		return { txRequestID, approved: approved, txResponse: txResult };
	},
);

const slice = createSlice( {
	name: "transaction-requests",
	initialState: txRequestsAdapter.getInitialState( {
		initialized: false,
	} ),
	reducers: {
		setTransactionRequests: ( state, { payload }: PayloadAction<ApprovalRequest[]>, ) => {
			txRequestsAdapter.setAll( state, payload );
			state.initialized = true;
		},
	},
	extraReducers: ( build ) => {
		build.addCase(
			respondToTransactionRequest.fulfilled,
			( state, { payload } ) => {
				const { txRequestID, approved: allowed, txResponse } = payload;
				txRequestsAdapter.updateOne( state, {
					id: txRequestID,
					changes: {
						approved: allowed,
						txResult: txResponse || undefined,
					},
				} );
			},
		);
	},
} );

export default slice.reducer;
export const { setTransactionRequests } = slice.actions;

export const txRequestsSelectors = txRequestsAdapter.getSelectors(
	( state: RootState ) => state.transactionRequests,
);
