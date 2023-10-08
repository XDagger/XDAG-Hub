import { useQuery } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { useField, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { createXDagRemarksValidation } from "./validation";
import { Text } from "_app/shared/text";
import { X12, QrCode } from "_assets/icons/tsIcons";
import Alert from "_src/ui/app/components/alert";
import { useRpcClient } from "_src/xdag/api";
import { isValidXDagAddress } from "_src/xdag/typescript/types";
import type { ChangeEventHandler } from "react";

export interface RemarkInputProps
{
	disabled?: boolean;
	placeholder?: string;
	name: string;
}

export function RemarkInput( { disabled: forcedDisabled, placeholder = "Limit to 32 chars", name = "remark", }: RemarkInputProps ) {

	const [ field, meta ] = useField( name );
	const { isSubmitting, setFieldValue } = useFormikContext();
	const xDagRemarkValidation = createXDagRemarksValidation();

	const disabled = forcedDisabled !== undefined ? forcedDisabled : isSubmitting;

	const handleOnChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>( ( e ) => {
			const remark = e.currentTarget.value;
			setFieldValue( name, xDagRemarkValidation.cast( remark ) );
		}, [ setFieldValue, name ,xDagRemarkValidation],
	);

	const clearRemark = useCallback( () => {
		setFieldValue( "remark", "" );
	}, [ setFieldValue ] );

	const formattedValue = useMemo(
		() => field?.value,
		[ field?.value ],
	);

	const hasWarningOrError = meta.touched && meta.error;

	return (
		<>
			<div
				className={ cx(
					"flex h-max w-full rounded-2lg bg-white border border-solid box-border focus-within:border-steel transition-all overflow-hidden",
					hasWarningOrError ? "border-issue" : "border-gray-45",
				) }
			>
				<div className="min-h-[42px] w-full flex items-center pl-3 py-2">
					<TextareaAutosize
						spellCheck={false}
						data-testid="remark-input"
						maxRows={ 1 }
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

				<div onClick={ clearRemark } className="flex bg-gray-40 items-center justify-center w-11 right-0 max-w-[20%] ml-4 cursor-pointer">
					<X12 className="h-3 w-3 text-steel-darker"/>
				</div>
			</div>

			{/*{ meta.touched ? (*/}
			{/*	<div className="mt-2.5 w-full">*/}
			{/*		<Alert*/}
			{/*			noBorder*/}
			{/*			rounded="lg"*/}
			{/*			mode={ meta.error ? "issue" : "success" }*/}
			{/*		>*/}
			{/*			<Text variant="pBodySmall" weight="medium">*/}
			{/*				{ meta.error || "Valid remark" }*/}
			{/*			</Text>*/}
			{/*		</Alert>*/}
			{/*	</div>*/}
			{/*) : null }*/}
		</>
	);
}
