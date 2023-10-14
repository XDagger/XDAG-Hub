import { useMemo } from "react";
import * as Yup from "yup";

export function createXDagRemarksValidation() {
	return Yup.string()
		.ensure()
		.required("Remark is required")
		.max(32, "Remark cannot exceed 32 characters")
		.matches(/^[\w+/]*$/, "Invalid Remark. Only Base64 characters and spaces are allowed.")
		.label("Remark");
}

export function useXDagRemarkValidation() {
	return useMemo( () => {
		return createXDagRemarksValidation( );
	}, [ ] );
}