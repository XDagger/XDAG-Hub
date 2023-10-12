import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { useField, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useXDagAddressValidation } from "./validation";
import { useRpcClient } from "_src/xdag/api";
import type { ChangeEventHandler } from "react";

export interface AddressInputProps
{
	disabled?: boolean;
	placeholder?: string;
	name: string;
}

export function AddressInput( { disabled: forcedDisabled, placeholder = "...", name = "to", }: AddressInputProps ) {
	const [ field, meta ] = useField( name );
	const rpc = useRpcClient();
	const { data: warningData } = useQuery( {
		queryKey: [ "address-input-warning", field.value ],
		queryFn: async () => {
			return null;
		},
		enabled: !!field.value,
		cacheTime: 10 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchInterval: false,
	} );

	const { isSubmitting, setFieldValue } = useFormikContext();
	const xDagAddressValidation = useXDagAddressValidation();

	const disabled = forcedDisabled !== undefined ? forcedDisabled : isSubmitting;
	const handleOnChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>( ( e ) => {
		const address = e.currentTarget.value;
		setFieldValue( name, xDagAddressValidation.cast( address ) );
	}, [ setFieldValue, name, xDagAddressValidation ], );

	const formattedValue = useMemo(
		() => xDagAddressValidation.cast( field?.value ),
		[ field?.value, xDagAddressValidation ],
	);

	const hasWarningOrError = false;

	return (
		<>
			<div
				className={
					cx(
						"flex h-max w-full rounded-2lg bg-white border border-solid box-border focus-within:border-steel transition-all overflow-hidden",
						hasWarningOrError ? "border-issue" : "border-gray-45",
					) }
			>
				<div className="min-h-[42px] w-full flex items-center pl-3 py-2">
					<TextareaAutosize
						spellCheck={ false }
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
			</div>

		</>
	);
}
