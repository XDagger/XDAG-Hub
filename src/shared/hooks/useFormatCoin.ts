import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { formatAmount } from "../utils/formatAmount";
import { useRpcClient } from "_src/xdag/api";
import { Coin, type CoinMetadata, XDAG_TYPE_ARG } from "_src/xdag/typescript/framework";

type FormattedCoin = [
	formattedBalance: string,
	coinSymbol: string,
	queryResult: UseQueryResult<CoinMetadata | null>,
];

export enum CoinFormat
{
	ROUNDED = "ROUNDED",
	FULL = "FULL",
}

export function formatBalance(
	balance: BigNumber,
	decimals: number,
	format: CoinFormat = CoinFormat.ROUNDED,
) {
	// const bn = new BigNumber( balance.toString() ).shiftedBy( -1 * decimals );
	const bn = balance;
	if ( format === CoinFormat.FULL ) {
		return bn.toFormat();
	}
	return formatAmount( bn );
}

const ELLIPSIS = "\u{2026}";
const SYMBOL_TRUNCATE_LENGTH = 5;
const NAME_TRUNCATE_LENGTH = 10;
export function useCoinMetadata( coinType?: string | null ) {
	const rpc = useRpcClient();
	return useQuery( {
		queryKey: [ "coin-metadata", coinType ],
		queryFn: async () => {
			if ( !coinType ) {
				throw new Error( "Fetching coin metadata should be disabled when coin type is disabled.", );
			}

			if ( coinType === XDAG_TYPE_ARG ) {
				const metadata: CoinMetadata = {
					id: null,
					decimals: 9,
					description: "",
					iconUrl: null,
					name: "XDag",
					symbol: "XDAG",
				};
				return metadata;
			}

			return rpc.getCoinMetadata( { coinType } );
		},
		select( data ) {
			if ( !data ) return null;

			return {
				...data,
				symbol: data.symbol.length > SYMBOL_TRUNCATE_LENGTH ? data.symbol.slice( 0, SYMBOL_TRUNCATE_LENGTH ) + ELLIPSIS : data.symbol,
				name: data.name.length > NAME_TRUNCATE_LENGTH ? data.name.slice( 0, NAME_TRUNCATE_LENGTH ) + ELLIPSIS : data.name,
			};
		},
		retry: false,
		enabled: !!coinType,
		staleTime: Infinity,
		cacheTime: 24 * 60 * 60 * 1000,
	} );
}

export function useFormatCoin( balance?: BigNumber, coinType?: string | null, format: CoinFormat = CoinFormat.ROUNDED, ): FormattedCoin {

	const fallbackSymbol = useMemo(
		() => (coinType ? Coin.getCoinSymbol( coinType ) : "")
		, [ coinType ]
	);

	const queryResult = useCoinMetadata( coinType );
	const { isFetched, data } = queryResult;

	const formatted = useMemo( () => {
			if ( typeof balance === "undefined" || balance === null ) return "";
			if ( !isFetched ) return "...";
			return formatBalance( balance, data?.decimals ?? 0, format );
		}, [ data?.decimals, isFetched, balance, format ]
	);

	return [
		formatted,
		"XDAG",
		queryResult,
	];
}
