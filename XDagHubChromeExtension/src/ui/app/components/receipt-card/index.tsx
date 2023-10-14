import { StatusIcon } from "./StatusIcon";
import { DateCard } from "../../shared/date-card";
import { TransactionSummary } from "../../shared/transaction-summary";
import { useTransactionSummary } from "_shared/hooks";
import type { XDagAddress, XDagTransactionBlockResponse } from "_src/xdag/typescript/types";
import { cx } from "class-variance-authority";
import "./index.css"
import { Text } from "_app/shared/text";
import { useTranslation } from "react-i18next";

type ReceiptCardProps = {
	txn: XDagTransactionBlockResponse;
	activeAddress: XDagAddress;
	isRefetching: boolean
};

//TXN:
// {
// 	"height": 0,
// 	"balance": "0.000000000",
// 	"blockTime": 1693981370053,
// 	"timeStamp": 1734636922935,
// 	"state": "Pending",
// 	"hash": "c254559db3f594cb78a00eaa57b807f2c0575a2eb4112282aad555a3346d42c6",
// 	"address": "xkJtNKNV1aqCIhG0LlpXwPIHuFeqDqB4",
// 	"remark": "xxxx",
// 	"diff": "0x1513de42a",
// 	"type": "Transaction",
// 	"flags": "0",
// 	"totalPage": 1,
// 	"refs": [
// 	{
// 		"direction": 2,
// 		"address": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
// 		"hashlow": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
// 		"amount": "0.000000000"
// 	},
// 	{
// 		"direction": 0,
// 		"address": "QCe7mZrnqDUVhvN4CGcRV2drB3gJm3TtH",
// 		"hashlow": "0000000000000000fe7e73ba7d7fbf439fc03aa914c4fd1ea16117e600000000",
// 		"amount": "1.000000000"
// 	},
// 	{
// 		"direction": 1,
// 		"address": "C3vw9K8wteBHkaFTEiezh825YQrYWz71k",
// 		"hashlow": "000000000000000079373ca9f48cc08551723fe33230a45f642a7e6b00000000",
// 		"amount": "1.000000000"
// 	}
// ],
// 	"transactions": []
// }
function TransactionStatus( { success, timestamp, state, isRefetching }: { success: boolean; timestamp?: string; state: string, isRefetching: boolean } ) {

	const { t } = useTranslation();
	const getState = ( state: any ) => {
		// state: "Main" | "Rejected" | "Accepted" | "Pending" | "error"
		const tKey = "TransactionStatus." + state;
		return t( tKey);
	}

	return (
		<div className="flex flex-col gap-3 items-center justify-center mb-4">
			<StatusIcon status={ success }/>
			<div className={ cx( state === "Accepted" ? "" : "blink" ) }>
				<h2>{ getState(state) }</h2>
			</div>
			{ timestamp && <DateCard timestamp={ Number( timestamp ) } size="md"/> }
			<Text color="steel-dark" weight={ "normal" } variant={ "pBodySmall" }>
				{ t( "TransactionStatus.BlinkingUntilBlockchainAccepted" ) }
			</Text>
			<Text color="steel-dark" weight={ "normal" } variant={ "pBodySmall" }>
				{ t( "TransactionStatus.WillTakeAbout5Minutes" ) }
			</Text>
			<Text color="steel-darker" weight={ "bold" } variant={ "pBodySmall" }>
				{ t( "TransactionStatus.CanLeaveOrViewOnExplorerOrWaitHere" ) }
			</Text>
		</div>
	);
}


export function ReceiptCard( { txn, activeAddress, isRefetching }: ReceiptCardProps ) {

	const summary = useTransactionSummary( {
		transaction: txn,
		currentAddress: activeAddress,
	} );

	if ( !summary ) return null;

	return (
		<div className="block relative w-full h-full overflow-hidden">
			<TransactionStatus
				success={ txn.state !== "error" && txn.state !== "Rejected" }
				timestamp={ (txn.blockTime ?? 0).toString() }
				state={ txn.state }
				isRefetching={ isRefetching }
			/>
			<TransactionSummary showGasSummary summary={ summary }/>
		</div>
	);
}
