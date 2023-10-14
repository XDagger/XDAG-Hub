import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DAppPermissionsList } from "../../components/DAppPermissionsList";
import { SummaryCard } from "../../components/SummaryCard";
import { WalletListSelect } from "../../components/WalletListSelect";
import { useActiveAddress } from "../../hooks/useActiveAddress";
import { PageMainLayoutTitle } from "../../shared/page-main-layout/PageMainLayoutTitle";
import Loading from "_components/loading";
import { UserApproveContainer } from "_components/user-approve-container";
import { useAppDispatch, useAppSelector } from "_hooks";
import {
	permissionsSelectors,
	respondToPermissionRequest,
} from "_redux/slices/permissions";
import type { XDagAddress } from "_src/xdag/typescript/types";
import type { RootState } from "_redux/RootReducer";
import st from "./SiteConnectPage.module.scss";
import { useTranslation } from "react-i18next";

function SiteConnectPage() {
	const { requestID } = useParams();

	const { t } = useTranslation()

	const permissionsInitialized = useAppSelector(
		( { permissions } ) => permissions.initialized,
	);
	const loading = !permissionsInitialized;
	const permissionSelector = useMemo(
		() => ( state: RootState ) =>
			requestID ? permissionsSelectors.selectById( state, requestID ) : null,
		[ requestID ],
	);
	const dispatch = useAppDispatch();
	const permissionRequest = useAppSelector( permissionSelector );
	const activeAddress = useActiveAddress();
	const [ accountsToConnect, setAccountsToConnect ] = useState<XDagAddress[]>(
		() => (activeAddress ? [ activeAddress ] : []),
	);
	const handleOnSubmit = useCallback(
		async ( allowed: boolean ) => {
			if ( requestID && accountsToConnect && permissionRequest ) {
				await dispatch(
					respondToPermissionRequest( {
						id: requestID,
						accounts: allowed ? accountsToConnect : [],
						allowed,
					} ),
				);
				window.close();
			}
		},
		[ requestID, accountsToConnect, permissionRequest, dispatch ],
	);

	useEffect( () => {
		if ( !loading && !permissionRequest ) {
			window.close();
		}
	}, [ loading, permissionRequest ] );

	const parsedOrigin = useMemo(
		() => (permissionRequest ? new URL( permissionRequest.origin ) : null),
		[ permissionRequest ],
	);

	const isSecure = parsedOrigin?.protocol === "https:";
	const [ displayWarning, setDisplayWarning ] = useState( !isSecure );

	const handleHideWarning = useCallback(
		async ( allowed: boolean ) => {
			if ( allowed ) {
				setDisplayWarning( false );
			} else {
				await handleOnSubmit( false );
			}
		},
		[ handleOnSubmit ],
	);

	useEffect( () => {
		setDisplayWarning( !isSecure );
	}, [ isSecure ] );

	return (
		<Loading loading={ loading }>
			{ permissionRequest &&
				(displayWarning ? (
					<UserApproveContainer
						origin={ permissionRequest.origin }
						originFavIcon={ permissionRequest.favIcon }
						approveTitle={ t( "SiteConnectPage.Continue" ) }
						rejectTitle={ t( "SiteConnectPage.Reject" ) }
						onSubmit={ handleHideWarning }
						isWarning
						addressHidden
						blended
					>
						<PageMainLayoutTitle title={ t( "SiteConnectPage.InsecureWebsite" ) }/>
						<div className={ st.warningWrapper }>
							<h1 className={ st.warningTitle }> { t( "SiteConnectPage.YourConnectionIsNotSecure" ) }</h1>
						</div>

						<div className={ st.warningMessage }>
							{ t( "SiteConnectPage.WarningInfo" ) }
							<br/>
							<br/>
							{ t( "SiteConnectPage.ContinueAtRisk" ) }
						</div>
					</UserApproveContainer>
				) : (
					<UserApproveContainer
						origin={ permissionRequest.origin }
						originFavIcon={ permissionRequest.favIcon }
						approveTitle={ t( "SiteConnectPage.Connect" ) }
						rejectTitle={ t( "SiteConnectPage.Reject" ) }
						onSubmit={ handleOnSubmit }
						approveDisabled={ !accountsToConnect.length }
						blended
					>
						<PageMainLayoutTitle title={ t( "SiteConnectPage.ApproveConnection" ) }/>
						<SummaryCard
							header={ t( "SiteConnectPage.PermissionsRequested" ) }
							body={
								<DAppPermissionsList
									permissions={ permissionRequest.permissions }
								/>
							}
							boxShadow
						/>
						<WalletListSelect
							title={ t( "SiteConnectPage.ConnectAccounts" ) }
							values={ accountsToConnect }
							onChange={ setAccountsToConnect }
							boxShadow
						/>
					</UserApproveContainer>
				)) }
		</Loading>
	);
}

export default SiteConnectPage;
