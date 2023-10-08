import { useEffect, useMemo } from "react";
import { XdagAppEmpty } from "./XdagAppEmpty";
import { useBackgroundClient } from "../../hooks/useBackgroundClient";
import { permissionsSelectors } from "../../redux/slices/permissions";
import Loading from "../loading";
import { Heading } from "_app/shared/heading";
import { Text } from "_app/shared/text";
import { useAppSelector } from "_hooks";
import { prepareLinkToCompare } from "_src/shared/utils";
import { DAppEntry, XDagApp } from "_components/xdag-apps/XdagApp";

const emptyArray: DAppEntry[] = [];

function ConnectedDapps() {
  const backgroundClient = useBackgroundClient();
  useEffect(() => {
    backgroundClient.sendGetPermissionRequests();
  }, [backgroundClient]);
  const ecosystemApps = emptyArray;
  const loading = useAppSelector(({ permissions }) => !permissions.initialized);
  const allPermissions = useAppSelector(permissionsSelectors.selectAll);
  const connectedApps = useMemo(
    () =>
      allPermissions
        .filter(({ allowed }) => allowed)
        .map((aPermission) => {
          const matchedEcosystemApp = ecosystemApps.find((anEcosystemApp) => {
            const originAdj = prepareLinkToCompare(aPermission.origin);
            const pageLinkAdj = aPermission.pagelink
              ? prepareLinkToCompare(aPermission.pagelink)
              : null;
            const anEcosystemAppLinkAdj = prepareLinkToCompare(
              anEcosystemApp.link,
            );
            return (
              originAdj === anEcosystemAppLinkAdj ||
              pageLinkAdj === anEcosystemAppLinkAdj
            );
          });
          let appNameFromOrigin = "";
          try {
            appNameFromOrigin = new URL(aPermission.origin).hostname
              .replace("www.", "")
              .split(".")[0];
          } catch (e) {
            // do nothing
          }
          return {
            name: aPermission.name || appNameFromOrigin,
            description: "",
            icon: aPermission.favIcon || "",
            link: aPermission.pagelink || aPermission.origin,
            tags: [],
            // override data from ecosystemApps
            ...matchedEcosystemApp,
            permissionID: aPermission.id,
          };
        }),
    [allPermissions, ecosystemApps],
  );
  return (
    <Loading loading={loading}>
      <div className="flex justify-center">
        <Heading variant="heading6" color="gray-90" weight="semibold">
          Active Connections
        </Heading>
      </div>
      <div className="my-4">
        <Text variant="pBodySmall" color="gray-80" weight="normal">
          Apps you have connected to through the Xdag Wallet in this browser.
        </Text>
      </div>

      <div className="mb-28 grid gap-3.75 grid-cols-2">
        {connectedApps.length ? (
          connectedApps.map((app) => (
            <XDagApp key={app.permissionID} {...app} displayType="card" />
          ))
        ) : (
          <>
            <XdagAppEmpty displayType="card" />
            <XdagAppEmpty displayType="card" />
          </>
        )}
      </div>
    </Loading>
  );
}

export default ConnectedDapps;
