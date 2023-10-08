import AutoLockTimerSelector from "./AutoLockTimerSelector";
import { MenuLayout } from "./MenuLayout";
import { useNextMenuUrl } from "../hooks";
import { Text } from "_src/ui/app/shared/text";
import { useTranslation } from "react-i18next";

export function AutoLockSettings() {
	const { t } = useTranslation()
	const backUrl = useNextMenuUrl( true, "/" );
	return (
		<MenuLayout title={ t( "AutoLockSettings.AutoLock" ) } back={ backUrl }>
			<div className="flex flex-col gap-3.75 mt-3.75">
				<Text color="gray-90" weight="medium" variant="pBody">
					{ t( "AutoLockSettings.SetTheIdleTime" ) }
				</Text>
				<AutoLockTimerSelector/>
			</div>
		</MenuLayout>
	);
}
