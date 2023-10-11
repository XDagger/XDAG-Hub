import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Content } from "_app/shared/bottom-menu-layout";
import FiltersPortal from "_components/filters-tags";
import { getFromSessionStorage, setToSessionStorage, } from "_src/background/storage-utils";
import AppsPlayGround, { ConnectedAppsCard, } from "_src/ui/app/components/xdag-apps";
import { xDagAppsConfigs } from "_pages/home/apps/appsConfig";
import st from "./AppsPage.module.scss";

const APPS_PAGE_NAVIGATION = "APPS_PAGE_NAVIGATION";

type FilterTag = {
	name: string;
	link: string;
};

function AppsPage() {
	const navigate = useNavigate();
	const defaultFilterTags: FilterTag[] = [
		// {
		// 	name: "Connections",
		// 	link: "apps/connected",
		// },
		{
			name: "All",
			link: "apps",
		},
	];
	const ecosystemApps = xDagAppsConfigs;
	const uniqueAppTags = Array.from( new Set( ecosystemApps.flatMap( ( app: any ) => app.tags ) ), )
		.map( ( tag ) => ({ name: tag, link: `apps/${ tag }`, }) )
		.sort( ( a: any, b ) => a.name.localeCompare( b.name ) );

	const allFilterTags = [ ...defaultFilterTags, ...uniqueAppTags ];

	useEffect( () => {
		getFromSessionStorage<string>( APPS_PAGE_NAVIGATION ).then(
			( activeTagLink ) => {
				if ( activeTagLink ) {
					navigate( `/${ activeTagLink }` );
					const element = document.getElementById( activeTagLink );
					if ( element ) {
						element.scrollIntoView();
					}
				}
			},
		);
	}, [ navigate ] );

	const handleFiltersPortalClick = async ( tag: FilterTag ) => {
		await setToSessionStorage<string>( APPS_PAGE_NAVIGATION, tag.link );
	};

	return (

		<div className={ st.container } data-testid="apps-page">
			<Content>
				<section>
					<FiltersPortal
						firstLastMargin
						tags={ allFilterTags as any }
						callback={ handleFiltersPortalClick }
					/>
					<Routes>
						<Route path="/connected" element={ <ConnectedAppsCard/> }/>
						<Route path="/:tagName?" element={ <AppsPlayGround xDagAppsConfigs={ xDagAppsConfigs }/> }/>
					</Routes>
				</section>
			</Content>
		</div>


	);
}

export default AppsPage;
export * from "./appsConfig"
