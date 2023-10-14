import {
	array,
	literal,
	number,
	object,
	optional,
	string,
	union,
} from "superstruct";
import type { Infer } from "superstruct";
import { TransactionDigest } from "_src/xdag/typescript/types/common";


export const GasCostSummary = object( {
	computationCost: string(),
	storageCost: string(),
	storageRebate: string(),
	nonRefundableStorageFee: string(),
} );
export type GasCostSummary = Infer<typeof GasCostSummary>;


//TRANSACITON BLOCK REFS:
// [
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
// ]
export const XDagTransactionDirectionTypeNumber = union( [
	literal( 0 ), //INPUT
	literal( 1 ), //OUTPUT
	literal( 2 ), //FEE
	literal( 3 ), //SNAPSHOT
] );
export type XDagTransactionDirectionTypeNumber = Infer<typeof XDagTransactionDirectionTypeNumber>;
export const XDagTransactionDirectionTypeText = [ "INPUT", "OUTPUT", "FEE" , "SNAPSHOT"]

export const XDagTransactionStatusType = union( [
	literal( "Main" ),
	literal( "Rejected" ),
	literal( "Accepted" ),
	literal( "Pending" ),
	literal( "error" )
] );
export type XDagTransactionStatusType = Infer<typeof XDagTransactionStatusType>;


//=====transaction block response from xdag server( level 2)=====
export const XDagTransactionBlockResponseRef = object( {
	address: string(),
	amount: number(),
	direction: XDagTransactionDirectionTypeNumber,
	hashlow: string(),
} )
export type XDagTransactionBlockResponseRef = Infer<typeof XDagTransactionBlockResponseRef>;

export const XDagTransactionBlockResponse = object( {
	address: string(),
	hash: string(),
	remark: optional( string() ),
	type: optional( string() ),
	state: XDagTransactionStatusType,
	blockTime: optional( number() ),
	refs: optional( array( XDagTransactionBlockResponseRef ) ),
	errorInfo: optional( string() ),
} );
export type XDagTransactionBlockResponse = Infer<typeof XDagTransactionBlockResponse>;

export const XDagSendRawTransactionBlockResponse = object( {
	result: string(),
	errorInfo: optional( string() ),
} );
export type XDagSendRawTransactionBlockResponse = Infer<typeof XDagSendRawTransactionBlockResponse>;


//=====address block response from xdag server( level 2)=====
export const XDagAddressBlockResponseTransactions = object( {
	direction: XDagTransactionDirectionTypeNumber,
	hashlow: string(),
	address: string(),
	amount: number(),
	time: number(),
	remark: optional( string() )
} )
export type XDagAddressBlockResponseTransactions = Infer<typeof XDagAddressBlockResponseTransactions>;
export const XDagAddressBlockResponse = object( {
	height: optional( number() ),
	balance: string(),
	blockTime: optional( number() ),
	timeStamp: optional( number() ),
	state: optional( XDagTransactionStatusType ),
	hash: optional( string() ),
	address: string(),
	remark: optional( string() ),
	diff: optional( string() ),
	type: optional( literal( "Wallet" ) ),
	flags: optional( string() ),
	totalPage: optional( number() ),
	refs: optional( string() ),
	transactions: optional( array( XDagAddressBlockResponseTransactions ) ),
} )
export type XDagAddressBlockResponse = Infer<typeof XDagAddressBlockResponse>;


//=====error response from xdag server( level 2)=====
export const XDagErrorResponse = object( {
	code: number(),
	message: string(),
} )
export type XDagErrorResponse = Infer<typeof XDagErrorResponse>;


//=====top level response from xdag server( level 1)======
export const XDagResponse = object( {
	jsonrpc: literal( "2.0" ),
	id: number(),
	result: optional( object() ),
	error: optional( object() ),
} )
export type XDagResponse = Infer<typeof XDagResponse>;


export function getTransactionDigest(
	tx: XDagTransactionBlockResponse,
): TransactionDigest {
	return tx.hash
}
