import { array, assert, define, integer, is, literal, nullable, object, optional, string, union, } from "superstruct";
import { BuilderCallArg, PureCallArg } from "./Inputs";
import { TransactionType, TransactionBlockInput } from "./Transactions";
import { builder } from "./bcs";
import { hashTypedData } from "./hash";
import { create } from "./utils";
import { toB58, toHEX } from "_src/xdag/bcs";
import type { Infer } from "superstruct";
import BigNumber from "bignumber.js";
import { XDagObjectRef } from "_src/xdag/typescript/types";

export const TransactionExpiration = optional(
	nullable(
		union( [
			object( { Epoch: integer() } ),
			object( { None: union( [ literal( true ), literal( null ) ] ) } ),
		] ),
	),
);
export type TransactionExpiration = Infer<typeof TransactionExpiration>;

const XDagAddress = string();
const StringEncodedBigint = define<string>( "StringEncodedBigint", ( val ) => {
	if ( ![ "string", "number", "bigint" ].includes( typeof val ) ) return false;
	try {
		BigInt( val as string );
		return true;
	} catch {
		return false;
	}
} );

const GasConfig = object( {
	budget: optional( StringEncodedBigint ),
	price: optional( StringEncodedBigint ),
	payment: optional( array( XDagObjectRef ) ),
	owner: optional( XDagAddress ),
} );
type GasConfig = Infer<typeof GasConfig>;

export const SerializedTransactionDataBuilder = object( {
	version: literal( 1 ),
	sender: optional( XDagAddress ),
	expiration: TransactionExpiration,
	gasConfig: GasConfig,
	inputs: array( TransactionBlockInput ),
	transactions: array( TransactionType ),
} );
export type SerializedTransactionDataBuilder = Infer<typeof SerializedTransactionDataBuilder>;

export class TransactionBlockDataBuilder
{
	version = 1 as const;
	sender?: string;
	expiration?: TransactionExpiration;
	gasConfig: GasConfig;
	inputs: TransactionBlockInput[];
	transactions: TransactionType[];

	constructor( clone?: SerializedTransactionDataBuilder ) {
		this.sender = clone?.sender;
		this.expiration = clone?.expiration;
		this.gasConfig = clone?.gasConfig ?? {};
		this.inputs = clone?.inputs ?? [];
		this.transactions = clone?.transactions ?? [];
	}


	static fromBytes( bytes: Uint8Array ) {
		const rawData = builder.de( "TransactionData", bytes );
		const data = rawData?.V1;
		const programmableTx = data?.kind?.ProgrammableTransaction;
		if ( !data || !programmableTx ) {
			throw new Error( "Unable to deserialize from bytes." );
		}
		const serialized = create(
			{
				version: 1,
				sender: data.sender,
				expiration: data.expiration,
				gasConfig: data.gasData,
				inputs: programmableTx.inputs.map( ( value: unknown, index: number ) =>
					create(
						{
							kind: "Input",
							value,
							index,
							type: is( value, PureCallArg ) ? "pure" : "object",
						},
						TransactionBlockInput,
					),
				),
				transactions: programmableTx.transactions,
			},
			SerializedTransactionDataBuilder,
		);
		return TransactionBlockDataBuilder.restore( serialized );
	}

	static restore( data: SerializedTransactionDataBuilder ) {
		assert( data, SerializedTransactionDataBuilder );
		const transactionData = new TransactionBlockDataBuilder();
		Object.assign( transactionData, data );
		return transactionData;
	}

	/**
	 * Generate transaction digest.
	 * @param bytes BCS serialized transaction data
	 * @returns transaction digest.
	 */
	static getDigestFromBytes( bytes: Uint8Array ) {
		const hash = hashTypedData( "TransactionData", bytes );
		return toB58( hash );
	}


	build( { maxSizeBytes = Infinity, overrides, onlyTransactionKind, }:
					 {
						 maxSizeBytes?: number;
						 overrides?: Pick<Partial<TransactionBlockDataBuilder>, "sender" | "gasConfig" | "expiration">;
						 onlyTransactionKind?: boolean;
					 } = {} ): Uint8Array {

		const sender = overrides?.sender ?? this.sender;
		if ( !sender ) {
			throw new Error( "Missing transaction sender" );
		}
		let resultObject = [] as any;
		for ( const tran of this.transactions ) {
			if ( tran.kind === "TransferXDag" ) {
				let transferObj = {} as any
				const addressInput = tran.address as any;
				transferObj.to = addressInput.value;
				transferObj.from = sender;
				let amount = BigNumber( 0 );
				let remark = "";
				for ( const obj of tran.objects ) {
					let o = obj as any
					if ( o.value && typeof o.value === "object" ) {
						transferObj.amount = BigNumber( o.value ).toNumber();
					}
					if ( o.value && typeof o.value === "string" ) {
						transferObj.remark = o.value
					}
				}
				resultObject.push(transferObj)
			}
		}
		let resultString = JSON.stringify(resultObject);
		const encoder = new TextEncoder();
		const resultUint8Array = encoder.encode(resultString);
		return resultUint8Array
	}



	getDigest() {
		const bytes = this.build( { onlyTransactionKind: false } );
		return TransactionBlockDataBuilder.getDigestFromBytes( bytes );
	}

	snapshot(): SerializedTransactionDataBuilder {
		return create( this, SerializedTransactionDataBuilder );
	}
}
