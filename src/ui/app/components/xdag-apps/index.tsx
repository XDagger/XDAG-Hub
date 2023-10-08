import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { permissionsSelectors } from "../../redux/slices/permissions";
import ExternalLink from "../external-link";
import { Heading } from "_app/shared/heading";
import { Text } from "_app/shared/text";
import { XdagAppEmpty } from "_components/xdag-apps/XdagAppEmpty";
import { useAppSelector } from "_hooks";
import { prepareLinkToCompare } from "_src/shared/utils";
import { useTranslation } from "react-i18next";
import { XDagApp } from "_components/xdag-apps/XdagApp";
import {appsArr} from "./appsConfig"

function AppsPlayGround() {

	const filteredEcosystemApps = appsArr;
	const allPermissions = useAppSelector( permissionsSelectors.selectAll );
	const { t } = useTranslation();

	const linkToPermissionID = useMemo( () => {
		const map = new Map<string, string>();
		for ( const aPermission of allPermissions ) {
			map.set( prepareLinkToCompare( aPermission.origin ), aPermission.id );
			if ( aPermission.pagelink ) {
				map.set( prepareLinkToCompare( aPermission.pagelink ), aPermission.id );
			}
		}
		return map;
	}, [ allPermissions ] );

	return (
		<>
			<div className="flex justify-center mb-4">
				<Heading variant="heading6" color="gray-90" weight="semibold">
					{ t( "AppsPlayGround.XDagApps" ) }
				</Heading>
			</div>

			{ filteredEcosystemApps?.length ? (
				<div className="p-4 bg-gray-40 rounded-xl">
					<Text variant="pBodySmall" color="gray-75" weight="normal">
						{ t( "AppsPlayGround.DoYouOwnResearch" ) }
					</Text>
				</div>
			) : null }

			{ filteredEcosystemApps?.length ? (
				<div className="flex flex-col divide-y divide-gray-45 divide-solid divide-x-0 mt-2 mb-28">
					{ filteredEcosystemApps.map( ( app: any ) => (
						<XDagApp
							key={ app.link }
							{ ...app }
							permissionID={ linkToPermissionID.get(
								prepareLinkToCompare( app.link ),
							) }
							displayType="full"
							openAppSite
						/>
					) ) }
				</div>
			) : (
				<XdagAppEmpty displayType="full"/>
			) }
		</>
	);
}

export default AppsPlayGround;
export { default as ConnectedAppsCard } from "./ConnectedAppsCard";
