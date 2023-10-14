import { bytesToHex } from "@noble/hashes/utils";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { MenuLayout } from "./MenuLayout";
import { PasswordInputDialog } from "./PasswordInputDialog";
import { HideShowDisplayBox } from "../../HideShowDisplayBox";
import Alert from "../../alert";
import { useNextMenuUrl } from "../hooks";
import { useBackgroundClient } from "_src/ui/app/hooks/useBackgroundClient";
import { fromB64 } from "_src/xdag/bcs";
import { useTranslation } from "react-i18next";

export function ExportAccount() {
	const accountUrl = useNextMenuUrl( true, `/accounts` );
	const { account } = useParams();
	const backgroundClient = useBackgroundClient();
	const { t } = useTranslation();

	const exportMutation = useMutation( {
		mutationKey: [ "export-account", account ],
		mutationFn: async ( password: string ) => {
			if ( !account ) {
				return null;
			}
			return await backgroundClient.exportAccount( password, account );
		},
	} );

	const privateKey = useMemo( () => {
		if ( exportMutation.data?.privateKey ) {
			return `0x${ bytesToHex(
				fromB64( exportMutation.data.privateKey ).slice( 0, 32 ),
			) }`;
		}
		return null;
	}, [ exportMutation.data?.privateKey ] );

	if ( !account ) {
		return <Navigate to={ accountUrl } replace/>;
	}

	if ( privateKey ) {
		return (
			<MenuLayout title={ t( "ExportAccount.YourPrivateKey" ) } back={ accountUrl }>
				<div className="flex flex-col flex-nowrap items-stretch gap-3">
					<Alert>
						<div>{ t( "ExportAccount.DoNotShare" ) }</div>
						<div>{ t( "ExportAccount.ItProvidesFullControl" ) }</div>
					</Alert>
					<HideShowDisplayBox
						value={ privateKey }
						copiedMessage={ t( "ExportAccount.PrivateKeyCopied" ) }
					/>
				</div>
			</MenuLayout>
		);
	}
	return (
		<PasswordInputDialog
			title={ t( "ExportAccount.ExportPrivateKey" ) }
			showArrowIcon
			onPasswordVerified={ async ( password ) => {
				await exportMutation.mutateAsync( password );
			} }
			background
			spacing
		/>
	);
}
