import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { useField, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useXDagAddressValidation } from "./validation";
import { Text } from "_app/shared/text";
import { X12, QrCode } from "_assets/icons/tsIcons";
import Alert from "_src/ui/app/components/alert";
import { useRpcClient } from "_src/xdag/api";
import { isValidXDagAddress } from "_src/xdag/typescript/types";
import type { ChangeEventHandler } from "react";

export interface AddressInputProps
{
	disabled?: boolean;
	placeholder?: string;
	name: string;
}

enum RecipientWarningType
{
	OBJECT = "OBJECT",
	EMPTY = "EMPTY",
}

export function AddressInput( {
																disabled: forcedDisabled,
																placeholder = "...",
																name = "to",
															}: AddressInputProps ) {
	const [ field, meta ] = useField( name );

	const rpc = useRpcClient();
	const { data: warningData } = useQuery( {
		queryKey: [ "address-input-warning", field.value ],
		queryFn: async () => {
			// We assume this validation will happen elsewhere:
			// if (!isValidXDagAddress(field.value)) {
			//   return null;
			// }
			//
			// const object = await rpc.getObject({ id: field.value });
			//
			// if (object && "data" in object) {
			//   return RecipientWarningType.OBJECT;
			// }

			// const [fromAddr, toAddr] = await Promise.all([
			//   rpc.queryTransactionBlocks({
			//     filter: { FromAddress: field.value },
			//     limit: 1,
			//   }),
			//   rpc.queryTransactionBlocks({
			//     filter: { ToAddress: field.value },
			//     limit: 1,
			//   }),
			// ]);
			//
			// if (fromAddr.data?.length === 0 && toAddr.data?.length === 0) {
			//   return RecipientWarningType.EMPTY;
			// }

			return null;
		},
		enabled: !!field.value,
		cacheTime: 10 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchInterval: false,
	} );

	const { isSubmitting, setFieldValue } = useFormikContext();
	const XdagAddressValidation = useXDagAddressValidation();

	const disabled = forcedDisabled !== undefined ? forcedDisabled : isSubmitting;
	const handleOnChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
		( e ) => {
			const address = e.currentTarget.value;
			setFieldValue( name, XdagAddressValidation.cast( address ) );
		},
		[ setFieldValue, name, XdagAddressValidation ],
	);
	const formattedValue = useMemo(
		() => XdagAddressValidation.cast( field?.value ),
		[ field?.value, XdagAddressValidation ],
	);

	const clearAddress = useCallback( () => {
		setFieldValue( "to", "" );
	}, [ setFieldValue ] );

	// const hasWarningOrError = meta.touched && (meta.error || warningData);
	const hasWarningOrError = false;


	return (
		<>
			<div
				className={ cx( "flex h-max w-full rounded-2lg bg-white border border-solid box-border focus-within:border-steel transition-all overflow-hidden",
					hasWarningOrError ? "border-issue" : "border-gray-45",
				) }
			>
				<div className="min-h-[42px] w-full flex items-center pl-3 py-2">
					<TextareaAutosize
						spellCheck={false}
						data-testid="address-input"
						maxRows={ 3 }
						minRows={ 1 }
						disabled={ disabled }
						placeholder={ placeholder }
						value={ formattedValue }
						onChange={ handleOnChange }
						onBlur={ field.onBlur }
						className={ cx(
							"w-full text-bodySmall leading-100 font-medium font-mono bg-white placeholder:text-steel-dark placeholder:font-normal placeholder:font-mono border-none resize-none",
							hasWarningOrError ? "text-issue" : "text-gray-90",
						) }
						name={ name }
					/>
				</div>

				{/*<div*/}
				{/*	onClick={ clearAddress }*/}
				{/*	className="flex bg-gray-40 items-center justify-center w-11 right-0 max-w-[20%] ml-4 cursor-pointer"*/}
				{/*>*/}
				{/*	{ meta.touched && field.value ? (*/}
				{/*		<X12 className="h-3 w-3 text-steel-darker"/>*/}
				{/*	) : (*/}
				{/*		<QrCode className="h-5 w-5 text-steel-darker"/>*/}
				{/*	) }*/}
				{/*</div>*/}
			</div>

			{/*{meta.touched ? (*/ }
			{/*  <div className="mt-2.5 w-full">*/ }
			{/*    <Alert*/ }
			{/*      noBorder*/ }
			{/*      rounded="lg"*/ }
			{/*      mode={meta.error || warningData ? "issue" : "success"}*/ }
			{/*    >*/ }
			{/*      {warningData === RecipientWarningType.OBJECT ? (*/ }
			{/*        <>*/ }
			{/*          <Text variant="pBody" weight="semibold">*/ }
			{/*            This address is an Object*/ }
			{/*          </Text>*/ }
			{/*          <Text variant="pBodySmall" weight="medium">*/ }
			{/*            Once sent, the funds cannot be recovered. Please make sure you*/ }
			{/*            want to send coins to this address.*/ }
			{/*          </Text>*/ }
			{/*        </>*/ }
			{/*      ) : warningData === RecipientWarningType.EMPTY ? (*/ }
			{/*        <>*/ }
			{/*          <Text variant="pBody" weight="semibold">*/ }
			{/*            This address has no prior transactions*/ }
			{/*          </Text>*/ }
			{/*          <Text variant="pBodySmall" weight="medium">*/ }
			{/*            Please make sure you want to send coins to this address.*/ }
			{/*          </Text>*/ }
			{/*        </>*/ }
			{/*      ) : (*/ }
			{/*        <Text variant="pBodySmall" weight="medium">*/ }
			{/*          {meta.error || "Valid address"}*/ }
			{/*        </Text>*/ }
			{/*      )}*/ }
			{/*    </Alert>*/ }
			{/*  </div>*/ }
			{/*) : null}*/ }
		</>
	);
}
