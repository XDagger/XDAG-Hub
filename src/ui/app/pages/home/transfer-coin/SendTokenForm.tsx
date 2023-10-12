import { useQuery } from "@tanstack/react-query";
import { Field, Form, useFormikContext, Formik } from "formik";
import { useMemo, useEffect } from "react";
import { createTokenTransferTransactionBlock } from "./utils/transaction";
import { createValidationSchemaStepOne } from "./validation";
import { useActiveAddress } from "_app/hooks/useActiveAddress";
import { Button } from "_app/shared/ButtonUI";
import BottomMenuLayout, { Content, Menu, } from "_app/shared/bottom-menu-layout";
import { Text } from "_app/shared/text";
import { ArrowRight16 } from "_assets/icons/tsIcons";
import { AddressInput } from "_components/address-input";
import Alert from "_components/alert";
import Loading from "_components/loading";
import { parseAmount } from "_helpers";
import { useGetAllCoins } from "_hooks";
import { GAS_SYMBOL } from "_redux/slices/xdag-objects/Coin";
import {
	useCoinMetadata,
	useFormatCoin,
	CoinFormat
} from "_shared/hooks";
import { InputWithAction } from "_src/ui/app/shared/InputWithAction";
import { type CoinStruct } from "_src/xdag/typescript/types";
import { XDAG_TYPE_ARG, Coin as CoinAPI, } from "_src/xdag/typescript/framework";
import { useRpcClient } from "_src/xdag/api";
import BigNumber from "bignumber.js";
import { RemarkInput } from "_components/remark-input";
import { useTranslation } from "react-i18next";

const initialValues = {
	to: "",
	amount: "",
	isPayAllXDag: false,
	gasBudgetEst: "",
	remark: "",
};

export type FormValues = typeof initialValues;

export type SubmitProps = {
	to: string;
	amount: string;
	isPayAllXDag: boolean;
	coinIds: string[];
	coins: CoinStruct[];
	gasBudgetEst: string;
	remark: string;
};

export type SendTokenFormProps = {
	coinType: string;
	onSubmit: ( values: SubmitProps ) => void;
	initialAmount: string;
	initialTo: string;
	initialRemark: string;
};

export function SendTokenForm( { coinType, onSubmit, initialAmount = "", initialTo = "", initialRemark = "" }: SendTokenFormProps ) {
	const rpc = useRpcClient();
	const activeAddress = useActiveAddress();

	const { t } = useTranslation();

	// Get all coins of the type
	const { data: coinsData, isLoading: coinsIsLoading } = useGetAllCoins( coinType, activeAddress!, );
	const { data: XDagCoinsData, isLoading: XDagCoinsIsLoading } = useGetAllCoins( XDAG_TYPE_ARG, activeAddress!, );

	const XDagCoins = XDagCoinsData;
	const coins = coinsData;
	const coinBalance = CoinAPI.totalBalance( coins || [] );
	const XDagBalance = CoinAPI.totalBalance( XDagCoins || [] );

	const coinMetadata = useCoinMetadata( coinType );
	const coinDecimals = coinMetadata.data?.decimals ?? 0;

	const [ tokenBalance, symbol, queryResult ] = useFormatCoin(
		BigNumber( coinBalance.toString() ),
		coinType,
		CoinFormat.FULL,
	);

	const validationSchemaStepOne = useMemo( () => createValidationSchemaStepOne(
			rpc,
			coinBalance,
			symbol,
			coinDecimals,
		), [ rpc, coinBalance, symbol, coinDecimals ],
	);

	// remove the comma from the token balance
	const formattedTokenBalance = tokenBalance.replace( /,/g, "" );
	const initAmountBig = parseAmount( initialAmount, coinDecimals );

	const onSubmitEvent = async ( { to, amount, isPayAllXDag, gasBudgetEst, remark }: FormValues ) => {
		if ( !coins || !XDagCoins ) return;
		const coinsIDs = [ ...coins ]
			.sort( ( a, b ) => Number( b.balance ) - Number( a.balance ) )
			.map( ( { coinObjectId } ) => coinObjectId );
		const data = { to, amount, isPayAllXDag, coins, coinIds: coinsIDs, gasBudgetEst, remark };
		onSubmit( data );
	}

	const hasEnoughBalance = ( values: any ) => {
		if ( !(values.amount) ) return true;
		if ( values.isPayAllXDag ) return true;
		return XDagBalance >= parseAmount( values.amount, 0 );
	}


	return (
		<Loading loading={ queryResult.isLoading || coinMetadata.isLoading || XDagCoinsIsLoading || coinsIsLoading }>
			<Formik
				initialValues={ {
					amount: initialAmount,
					to: initialTo,
					isPayAllXDag: !!initAmountBig && initAmountBig === coinBalance && coinType === XDAG_TYPE_ARG,
					gasBudgetEst: "",
					remark: initialRemark,
				} }
				validationSchema={ validationSchemaStepOne }
				enableReinitialize
				validateOnMount
				validateOnChange
				onSubmit={ onSubmitEvent }
			>


				{
					( { isValid, isSubmitting, setFieldValue, values, submitForm, validateField } ) => {

						const newPayXDagAll = parseAmount( values.amount, coinDecimals ) === coinBalance && coinType === XDAG_TYPE_ARG;
						if ( values.isPayAllXDag !== newPayXDagAll ) {
							setFieldValue( "isPayAllXDag", newPayXDagAll );
						}
						const enough = hasEnoughBalance( values );

						return (
							<BottomMenuLayout>
								<Content>
									<Form autoComplete="off" noValidate>
										<div className="w-full flex flex-col flex-grow">
											<div className="px-2 mb-2.5">
												<Text variant="caption" color="steel" weight="semibold">
													{ t( "SendTokenForm.SelectCoinAmountToSend" ) }
												</Text>
											</div>
											<InputWithAction
												data-testid="coin-amount-input"
												type="numberInput"
												name="amount"
												placeholder="0.00"
												prefix={ values.isPayAllXDag ? "~ " : "" }
												actionText="Max"
												suffix={ ` ${ symbol }` }
												actionType="button"
												allowNegative={ false }
												decimals
												rounded="lg"
												dark
												onActionClicked={ async () => {
													// using await to make sure the value is set before the validation
													await setFieldValue( "amount", formattedTokenBalance );
													validateField( "amount" );
												} }
												actionDisabled={ parseAmount( values?.amount, coinDecimals ) === coinBalance || queryResult.isLoading || !coinBalance }
											/>
										</div>

										{ !enough ? (
											<div className="mt-3">
												<Alert>{ t( "SendTokenForm.InsufficientXDAGToCoverTransaction" ) }</Alert>
											</div>
										) : null }

										{/*{ coins ? (<GasBudgetEstimation coinDecimals={ coinDecimals } coins={ coins }/>) : null }*/ }

										<div className="w-full flex gap-2.5 flex-col mt-7.5">
											<div className="px-2 tracking-wider">
												<Text variant="caption" color="steel" weight="semibold">
													{ t( "SendTokenForm.EnterRecipientAddress" ) }
												</Text>
											</div>
											<div className="w-full flex relative items-center flex-col">
												<Field
													component={ AddressInput }
													name="to"
													placeholder={ t( "SendTokenForm.EnterAddress" ) }
												/>
											</div>
										</div>


										<div className="w-full flex gap-2.5 flex-col mt-7.5">
											<div className="px-2 tracking-wider">
												<Text variant="caption" color="steel" weight="semibold">
													{ t( "SendTokenForm.EnterRemark" ) }
												</Text>
											</div>
											<div className="w-full flex relative items-center flex-col">
												<Field
													component={ RemarkInput }
													name="remark"
													placeholder={ t( "SendTokenForm.Limited32Chars" ) }
												/>
											</div>
										</div>
									</Form>
								</Content>


								<Menu stuckClass="sendCoin-cta" className="w-full px-0 pb-0 mx-0 gap-2.5">
									<Button
										type="submit"
										onClick={ submitForm }
										variant="primary"
										loading={ isSubmitting }
										disabled={ !isValid || isSubmitting || !enough }
										size="tall"
										text={ t( "SendTokenForm.Review" ) }
										after={ <ArrowRight16/> }
									/>
								</Menu>
							</BottomMenuLayout>
						);
					}
				}
			</Formik>
		</Loading>
	);
}