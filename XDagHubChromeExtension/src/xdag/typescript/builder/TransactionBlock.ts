import { is, mask } from "superstruct";
import { getIdFromCallArg, Inputs, } from "./Inputs";
import { TransactionBlockDataBuilder } from "./TransactionBlockData";
import { Transactions, TransactionBlockInput, } from "./Transactions";
import { XDagObjectRef } from "../types/index";
import { fromB64 } from "_src/xdag/bcs";
import type { ObjectCallArg } from "./Inputs";
import type { TransactionExpiration } from "./TransactionBlockData";
import type { TransactionArgument, TransactionType, } from "./Transactions";
import type { XdagClient } from "../client/index";
import type { JsonRpcProvider } from "../rpc/json-rpc-provider";
import type { ObjectId, ProtocolConfig, } from "../types/index";
import { create } from "./utils";


type TransactionResult = TransactionArgument & TransactionArgument[];

const DefaultOfflineLimits = {
	maxPureArgumentSize: 16 * 1024,
	maxTxGas: 50_000_000_000,
	maxGasObjects: 256,
	maxTxSizeBytes: 128 * 1024,
} satisfies Limits;

function createTransactionResult( index: number ): TransactionResult {
	const baseResult: TransactionArgument = { kind: "Result", index };
	const nestedResults: TransactionArgument[] = [];
	const nestedResultFor = ( resultIndex: number ): TransactionArgument =>
		(nestedResults[ resultIndex ] ??= {
			kind: "NestedResult",
			index,
			resultIndex,
		});
	return new Proxy( baseResult, {
		set() {
			throw new Error(
				"The transaction result is a proxy, and does not support setting properties directly",
			);
		},
		// TODO: Instead of making this return a concrete argument, we should ideally
		// make it reference-based (so that this gets resolved at build-time), which
		// allows re-ordering transactions.
		get( target, property ) {
			// This allows this transaction argument to be used in the singular form:
			if ( property in target ) {
				return Reflect.get( target, property );
			}
			// Support destructuring:
			if ( property === Symbol.iterator ) {
				return function* () {
					let i = 0;
					while ( true ) {
						yield nestedResultFor( i );
						i++;
					}
				};
			}
			if ( typeof property === "symbol" ) return;
			const resultIndex = parseInt( property, 10 );
			if ( Number.isNaN( resultIndex ) || resultIndex < 0 ) return;
			return nestedResultFor( resultIndex );
		},
	} ) as TransactionResult;
}

function expectClient( options: BuildOptions ): JsonRpcProvider | XdagClient {
	if ( !options.client ) {
		throw new Error( `No provider passed to Transaction#build, but transaction data was not sufficient to build offline.`, );
	}
	return options.client;
}

const TRANSACTION_BRAND = Symbol.for( "@XDag/transaction" );

const LIMITS = {
	// The maximum gas that is allowed.
	maxTxGas: "max_tx_gas",
	// The maximum number of gas objects that can be selected for one transaction.
	maxGasObjects: "max_gas_payment_objects",
	// The maximum size (in bytes) that the transaction can be:
	maxTxSizeBytes: "max_tx_size_bytes",
	// The maximum size (in bytes) that pure arguments can be:
	maxPureArgumentSize: "max_pure_argument_size",
} as const;

type Limits = Partial<Record<keyof typeof LIMITS, number>>;


const chunk = <T>( arr: T[], size: number ): T[][] =>
	Array.from( { length: Math.ceil( arr.length / size ) }, ( _, i ) => arr.slice( i * size, i * size + size ), );

interface BuildOptions
{
	client?: XdagClient | JsonRpcProvider;
	onlyTransactionKind?: boolean;
	/** Define a protocol config to build against, instead of having it fetched from the provider at build time. */
	protocolConfig?: ProtocolConfig;
	/** Define limits that are used when building the transaction. In general, we recommend using the protocol configuration instead of defining limits. */
	limits?: Limits;
}


export class TransactionBlock
{
	#blockData: TransactionBlockDataBuilder;

	/** Returns `true` if the object is an instance of the Transaction builder class. */
	static is( obj: unknown ): obj is TransactionBlock {
		return (
			!!obj &&
			typeof obj === "object" &&
			(obj as any)[ TRANSACTION_BRAND ] === true
		);
	}

	static from( serialized: string | Uint8Array ) {
		const tx = new TransactionBlock();
		// Check for bytes:
		if ( typeof serialized !== "string" || !serialized.startsWith( "{" ) ) {
			tx.#blockData = TransactionBlockDataBuilder.fromBytes(
				typeof serialized === "string" ? fromB64( serialized ) : serialized,
			);
		} else {
			tx.#blockData = TransactionBlockDataBuilder.restore(
				JSON.parse( serialized ),
			);
		}
		return tx;
	}

	/** A helper to retrieve the Transaction builder `Transactions` */
	static get Transactions() {
		return Transactions;
	}

	/** A helper to retrieve the Transaction builder `Inputs` */
	static get Inputs() {
		return Inputs;
	}

	setSender( sender: string ) {
		this.#blockData.sender = sender;
	}

	/**
	 * Sets the sender only if it has not already been set.
	 * This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
	 */
	setSenderIfNotSet( sender: string ) {
		if ( !this.#blockData.sender ) {
			this.#blockData.sender = sender;
		}
	}

	setExpiration( expiration?: TransactionExpiration ) {
		this.#blockData.expiration = expiration;
	}

	setGasPrice( price: number | bigint ) {
		this.#blockData.gasConfig.price = String( price );
	}

	setGasBudget( budget: number | bigint ) {
		this.#blockData.gasConfig.budget = String( budget );
	}

	setGasOwner( owner: string ) {
		this.#blockData.gasConfig.owner = owner;
	}

	setGasPayment( payments: XDagObjectRef[] ) {
		this.#blockData.gasConfig.payment = payments.map( ( payment ) =>
			mask( payment, XDagObjectRef ),
		);
	}

	/** Get a snapshot of the transaction data, in JSON form: */
	get blockData() {
		return this.#blockData.snapshot();
	}

	// Used to brand transaction classes so that they can be identified, even between multiple copies
	// of the builder.
	get [ TRANSACTION_BRAND ]() {
		return true;
	}

	constructor( transaction?: TransactionBlock ) {
		this.#blockData = new TransactionBlockDataBuilder( transaction ? transaction.blockData : undefined, );
	}

	/** Returns an argument for the gas coin, to be used in a transaction. */
	get gas(): TransactionArgument {
		return { kind: "GasCoin" };
	}

	/**
	 * Dynamically create a new input, which is separate from the `input`. This is important
	 * for generated clients to be able to define unique inputs that are non-overlapping with the
	 * defined inputs.
	 *
	 * For `Uint8Array` type automatically convert the input into a `Pure` CallArg, since this
	 * is the format required for custom serialization.
	 *
	 */
	#input( type: "object" | "pure", value?: unknown ) {
		const index = this.#blockData.inputs.length;
		const input = create(
			{
				kind: "Input",
				// bigints can't be serialized to JSON, so just string-convert them here:
				value: typeof value === "bigint" ? String( value ) : value,
				index,
				type,
			},
			TransactionBlockInput,
		);
		this.#blockData.inputs.push( input );
		return input;
	}

	/**
	 * Add a new object input to the transaction.
	 */
	object( value: ObjectId | ObjectCallArg ) {
		const id = getIdFromCallArg( value );
		// deduplicate
		const inserted = this.#blockData.inputs.find(
			( i ) => i.type === "object" && id === getIdFromCallArg( i.value ),
		);
		return inserted ?? this.#input( "object", value );
	}


	pure( value: unknown, type?: string, ) {
		return this.#input( "pure", value instanceof Uint8Array ? Inputs.Pure( value ) : type ? Inputs.Pure( value, type ) : value, );
	}

	/** Add a transaction to the transaction block. */
	add( transaction: TransactionType ) {
		const index = this.#blockData.transactions.push( transaction );
		return createTransactionResult( index - 1 );
	}


	transferXDag( ...args: Parameters<(typeof Transactions)["TransferXDag"]> ) {
		return this.add( Transactions.TransferXDag( ...args ) );
	}

	serialize() {
		return JSON.stringify( this.#blockData.snapshot() );
	}

	#getConfig(
		key: keyof typeof LIMITS,
		{ protocolConfig, limits }: BuildOptions,
	) {
		// Use the limits definition if that exists:
		if ( limits && typeof limits[ key ] === "number" ) {
			return limits[ key ]!;
		}
		if ( !protocolConfig ) {
			return DefaultOfflineLimits[ key ];
		}
		// Fallback to protocol config:
		const attribute = protocolConfig?.attributes[ LIMITS[ key ] ];
		if ( !attribute ) {
			throw new Error( `Missing expected protocol config: "${ LIMITS[ key ] }"` );
		}
		const value = "u64" in attribute ? attribute.u64 : "u32" in attribute ? attribute.u32 : attribute.f64;

		if ( !value ) {
			throw new Error( `Unexpected protocol config value found for: "${ LIMITS[ key ] }"`, );
		}

		// NOTE: Technically this is not a safe conversion, but we know all of the values in protocol config are safe
		return Number( value );
	}

	/** Build the transaction to BCS bytes. */
	async build( options: BuildOptions = {} ): Promise<Uint8Array> {
		await this.#prepare( options );
		return this.#blockData.build( {
			maxSizeBytes: this.#getConfig( "maxTxSizeBytes", options ),
			onlyTransactionKind: options.onlyTransactionKind,
		} );
	}

	async #prepare( options: BuildOptions ) {
	}
}
