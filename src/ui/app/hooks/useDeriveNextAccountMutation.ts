import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useBackgroundClient } from "./useBackgroundClient";
import { useTranslation } from "react-i18next";

export function useDeriveNextAccountMutation() {
	const backgroundClient = useBackgroundClient();
	const { t } = useTranslation()
	return useMutation( {
		mutationFn: () => {
			return backgroundClient.deriveNextAccount();
		},
		onSuccess: () => {
			toast.success( t("useDeriveNextAccountMutation.NewAccountCreated"));
		},
		onError: ( e ) => {
			toast.error( (e as Error).message || "Failed to create new account" );
		},
	} );
}
