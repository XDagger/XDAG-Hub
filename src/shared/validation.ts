import BigNumber from "bignumber.js";
import * as Yup from "yup";
import { formatBalance } from "_shared/hooks";
import i18next from "i18next";

export function createTokenValidation( coinBalance: BigNumber, coinSymbol: string, decimals: number, ) {

	const _BalanceText = formatBalance( BigNumber( coinBalance.toString() ), decimals, ) + coinSymbol;
	const _Symbol = coinSymbol
	const _Decimals = decimals.toString();

	return Yup.mixed()
		.transform( ( _, original ) => {return new BigNumber( original );} )
		.test(
			"required",
			i18next.t( "createTokenValidation.isRequired"),
			( value ) => {return !!value;} )
		.test(
			"valid",
			i18next.t( "createTokenValidation.ValueIsInvalid" ),
			( value?: BigNumber ) => {
				if ( !value || value.isNaN() || !value.isFinite() ) {
					return false;
				}
				return true;
			} )
		.test(
			"min",
			i18next.t( "createTokenValidation.ShouldBeGreaterThan0", {_Symbol} ),
			( amount?: BigNumber ) => (amount ? amount.gt( 0 ) : false),
		)
		.test(
			"max",
			i18next.t( "createTokenValidation.MustBeLessThan", {_BalanceText} ),
			// `\${path} must be less than ${ formatBalance( BigNumber( coinBalance.toString() ), decimals, ) } ${ coinSymbol }`,
			( amount?: BigNumber ) => {
				return amount ? amount <= coinBalance : false
			},
		)
		.label( "Amount" );
}
