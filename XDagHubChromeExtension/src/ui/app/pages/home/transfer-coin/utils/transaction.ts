import { parseAmount } from "_src/ui/app/helpers";
import { TransactionBlock } from "_src/xdag/typescript/builder";
import { XDAG_TYPE_ARG } from "_src/xdag/typescript/framework";
import { type CoinStruct } from "_src/xdag/typescript/types";
import BigNumber from "bignumber.js";

interface Options
{
	coinType: string;
	to: string;
	amount: string;
	coinDecimals: number;
	isPayAllXDag: boolean;
	coins: CoinStruct[];
	remark: string;
}

export function createTokenTransferTransactionBlock( { to, amount, coins, coinType, coinDecimals, remark, isPayAllXDag }: Options ) {
	const tx = new TransactionBlock();
	const bigNumberAmount = parseAmount( amount, coinDecimals );
	tx.transferXDag( [ tx.pure( bigNumberAmount ), tx.pure( remark ) ], tx.pure( to ) )
	return tx;
}

export function createXDagTransferTransactionBlock( to: string, amount: number | undefined, remark: string | undefined ) {
	const tx = new TransactionBlock();
	const bigNumberAmount = new BigNumber( (amount ?? 0).toString() );
	tx.transferXDag( [ tx.pure( bigNumberAmount ), tx.pure( remark??"" ) ], tx.pure( to ) )
	return tx;
}
