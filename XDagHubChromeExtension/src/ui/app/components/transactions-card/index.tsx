import { TxnIcon } from "./TxnIcon";
import { DateCard } from "_app/shared/date-card";
import { Text } from "_app/shared/text";
import {	XDagAddressBlockResponseTransactions } from "_src/xdag/typescript/types";
import type { XDagAddress, } from "_src/xdag/typescript/types";
import BigNumber from "bignumber.js";
import cl from "classnames";
import { getTransactionUrl } from "_components/explorer-link/Explorer";
import useAppSelector from "../../hooks/useAppSelector";
import { useTranslation } from "react-i18next";

export function TransactionCard( { txn, address, }: {
	txn: XDagAddressBlockResponseTransactions;
	address: XDagAddress;
} ) {

	const networkName = useAppSelector( ( { app: { apiEnv } } ) => apiEnv );
	const { t } = useTranslation();

	const clickIconEvent = ( address: string ) => {
		const url = getTransactionUrl( address, networkName, "" )
		if ( url ) {
			window.open( url, "_blank" );
		}
	}

	return (

		<div
			className={ cl( "flex flex-row w-full cursor-pointer py-2", txn.direction === 0 ? " bg-gray-40 " : "" ) }
			onClick={ () => clickIconEvent( txn.address ) }
		>

			<div className="w-1/6 ">
				<TxnIcon variant={ txn.direction === 0 ? "Receive" : "Send" }></TxnIcon>
			</div>

			<div className="w-5/6 justify-between">
				<div className="flex gap-1 items-baseline">
					<Text color={ txn.direction === 0 ? "hero-dark" : "steel-darker" } weight="semibold">
						<span className={ "font-bold  mr-1.5 " }>{ BigNumber( txn.amount ).toNumber() }</span>
						<span className={ "font-bold " }>XDAG</span>
					</Text>
					<DateCard timestamp={ Number( txn.time ) } size="sm"/>
				</div>


				<div className="flex gap-1 items-baseline">
						<span className="mr-1.5">
						<Text color="gray-60" weight="medium">
							{ t( "TransactionCard.Remark" ) }
						</Text>
						</span>
					<Text color="gray-70" weight="semibold">
						{ txn.remark }
					</Text>
				</div>

			</div>
		</div>
	);
}
