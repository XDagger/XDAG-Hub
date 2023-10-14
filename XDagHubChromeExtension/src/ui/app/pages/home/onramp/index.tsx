import { useNavigate } from "react-router-dom";
import Alert from "_src/ui/app/components/alert";
import Overlay from "_src/ui/app/components/overlay";
import { useActiveAddress } from "_src/ui/app/hooks";
import { Heading } from "_src/ui/app/shared/heading";
import { mexcImg, coinexImg, uubiterImg } from "_assets/png"
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Text } from "_app/shared/text";
import { useGetExchagePrice } from "_app/hooks/useGetExchangePrice";

/**
 * onramp:  means the door of this area, The onramp from fiat currency to blockchain-based cryptocurrencies.
 * @constructor
 */

export function Onramp() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const mexcChangeXDagUsdt = "https://api.mexc.com/api/v3/trades?symbol=XDAGUSDT";
	const mexcApiData = useGetExchagePrice(mexcChangeXDagUsdt)
	const [ mexcDeal, setMexcDeal ] = useState<{ price: string | undefined, type: string | undefined, amount: string | undefined }>();
	useEffect( () => {
		try{
			let dealData = (mexcApiData as any)[0];
			if ( dealData ) {
				setMexcDeal( { price: dealData.price, type: dealData.tradeType, amount: dealData.qty } )
			}
		}catch ( e ){
			console.error("error in query mexcApiData" )
		}
	}, [ mexcApiData ] )



	const coinexChangeXDagUsdt = "https://api.coinex.com/v1/market/deals?market=XDAGUSDT";
	const coinexApiData = useGetExchagePrice(coinexChangeXDagUsdt)
	const [ coinexDeal, setCoinexDeal ] = useState<{ price: string | undefined, type: string | undefined, amount: string | undefined }>();
	useEffect( () => {
		try{
			let dealData = (coinexApiData as any)?.data[0];
			if ( dealData ) {
				setCoinexDeal( { price: dealData.price, type: dealData.type, amount: dealData.amount } )
			}
		}catch ( e ){
			console.error("error in query coinexApiData" )
		}
	}, [ coinexApiData ] )



	const onClickItem = ( url: string ) => {
		window.open( url, "_blank" );
	}

	return (
		<Overlay
			showModal
			title={ t( "OnRamp.Buy" ) }
			closeOverlay={ () => {navigate( "/tokens" );} }
		>
			<div className="w-full flex-col ">

				<button className="w-full p-6 bg-Xdag/10 rounded-2xl flex items-center border-0 cursor-pointer mb-3.5"
								onClick={ () => onClickItem( "https://www.mexc.com/exchange/XDAG_USDT" ) }
				>
					<img src={ mexcImg } alt={ "Mexc exchange" } style={ { width: '35px', height: '35px' } }/>
					<Heading variant="heading6" weight="semibold" color="hero-dark">
						{ t( "OnRamp.MexcExchange" ) }
					</Heading>
					<div className=" flex flex-col items-start ml-3 ">
						<Text weight="bold" color={ mexcDeal?.type === "ASK" ? "issue-dark" : "success-dark" } mono nowrap>{ mexcDeal?.price }</Text>
						<Text weight="bold" color="hero-dark" variant="captionSmall">{ mexcDeal?.type } </Text>
						<Text weight="bold" color="hero-dark" variant="captionSmall">{ parseInt(mexcDeal?.amount??"0") } </Text>
					</div>
				</button>


				<button className="w-full p-6 bg-Xdag/10 rounded-2xl flex items-center border-0 cursor-pointer mb-3.5"
								onClick={ () => onClickItem( "https://www.coinex.com/en/exchange/xdag-usdt" ) }
				>
					<img src={ coinexImg } alt={ "coinex exchange" } style={ { width: '35px', height: '35px' } }/>
					<Heading variant="heading6" weight="semibold" color="hero-dark">
						{ t( "OnRamp.CoinExExchange" ) }
					</Heading>
					<div className=" flex flex-col items-start ml-2 ">
						<Text weight="bold" color={ coinexDeal?.type === "sell" ? "issue-dark" : "success-dark" } mono nowrap>{ coinexDeal?.price }</Text>
						<Text weight="bold" color="hero-dark" variant="captionSmall">{ coinexDeal?.type } </Text>
						<Text weight="bold" color="hero-dark" variant="captionSmall">{ parseInt(coinexDeal?.amount??"0") } </Text>
						<Text weight="bold" color="issue-dark" variant="captionSmall">HACKED</Text>
					</div>
				</button>


				<button className="w-full p-6 bg-Xdag/10 rounded-2xl flex items-center border-0 cursor-pointer mb-3.5"
								onClick={ () => onClickItem( "https://www.uubiter.com/spot/#/index/xdag_usdt" ) }
				>
					<img src={ uubiterImg } alt={ "Mexc exchange" } style={ { width: '35px', height: '35px' } }/>
					<Heading variant="heading6" weight="semibold" color="hero-dark">
						{ t( "OnRamp.UUbiterExchange" ) }
					</Heading>
				</button>

			</div>
		</Overlay>
	);

}
