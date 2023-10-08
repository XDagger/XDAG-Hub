import { useEffect, useState } from "react";
import { Text } from "../../text";
import { Card } from "../Card";
import { ArrowUpRight12 } from "_assets/icons/tsIcons";
import { ExplorerLinkType } from "_src/ui/app/components/explorer-link/ExplorerLinkType";
import { useExplorerLink } from "_src/ui/app/hooks/useExplorerLink";
import { useTranslation } from "react-i18next";

const TIME_TO_WAIT_FOR_EXPLORER = 60 * 1000;

function useShouldShowExplorerLink( timestamp?: string, digest?: string ) {
	const [ shouldShow, setShouldShow ] = useState( false );
	useEffect( () => {
		if ( !digest ) return;
		const diff = Date.now() - new Date( Number( timestamp ) ).getTime();
		// if we have a timestamp, wait at least 1m from the timestamp, otherwise wait 1m from now
		const showAfter = timestamp ? Math.max( 0, TIME_TO_WAIT_FOR_EXPLORER - diff ) : TIME_TO_WAIT_FOR_EXPLORER;
		const timeout = setTimeout( () => setShouldShow( true ), showAfter );
		return () => clearTimeout( timeout );
	}, [ timestamp, digest ] );

	return shouldShow;
}

export function ExplorerLinkCard( { digest, timestamp, }: {
	digest?: string;
	timestamp?: string;
} ) {
	const explorerHref = useExplorerLink( { type: ExplorerLinkType.transaction, transactionID: digest!, } );
	const { t } = useTranslation()

	return (
		<Card as="a" href={ explorerHref! } target="_blank">
			<div className="flex items-center justify-center gap-1 tracking-wider w-full">
				<Text variant="captionSmall" weight="semibold">
					{ t( "ExplorerLinkCard.ViewOnExplorer" ) }
				</Text>
				<ArrowUpRight12 className="text-steel text-pSubtitle"/>
			</div>
		</Card>
	);
}
