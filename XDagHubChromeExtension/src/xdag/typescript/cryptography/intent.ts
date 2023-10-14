


// See: Xdag/crates/xdag-types/src/intent.rs
export enum AppId
{
	Xdag = 0,
}

export enum IntentVersion
{
	V0 = 0,
}

export enum IntentScope
{
	TransactionData = 0,
	PersonalMessage = 3,
	TransactionTransfer = 4,
}

export type Intent = [ IntentScope, IntentVersion, AppId ];

function intentWithScope( scope: IntentScope ): Intent {
	return [ scope, IntentVersion.V0, AppId.Xdag ];
}

export function messageWithIntent( scope: IntentScope, message: Uint8Array ) {
	const intent = intentWithScope( scope );
	const intentMessage = new Uint8Array( intent.length + message.length );
	intentMessage.set( intent );
	intentMessage.set( message, intent.length );
	return intentMessage;
}
