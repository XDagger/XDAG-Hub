import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allDApps, allCommunities } from 'contentlayer/generated'
import Main from './Main'
import GithubSlugger from "github-slugger";
import { writeFileSync } from 'fs'
import getConfig from 'next/config';

// let tagCount = undefined as any;
// let tagCount: Record<string, number> | undefined = undefined;

export default async function Page() {

	const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

	const sortedPosts = sortPosts( allDApps ?? [] )
	const posts = allCoreContent( sortedPosts )

	/**
	 * Count the occurrences of all tags across blog posts and write to json file
	 */
	const createTagCount = ( allApps ) => {
		// const tagCount: Record<string, number> = {}
		// tagCount = {};


		console.log( publicRuntimeConfig.tagCount ); // 输出 10

		// publicRuntimeConfig.tagCount = 20;

		allApps.forEach( ( file ) => {
				if ( file.tags && (file.draft !== true) ) {
					file.tags.forEach( ( tag ) => {
						const formattedTag = GithubSlugger.slug( tag )
						if ( formattedTag in publicRuntimeConfig.tagCount ) {
							publicRuntimeConfig.tagCount [ formattedTag ] += 1
						} else {
							publicRuntimeConfig.tagCount [ formattedTag ] = 1
						}
					} )
				}
			}
		)

		console.log( '.............', publicRuntimeConfig.tagCount )
		writeFileSync( './app/tag-data.json', JSON.stringify( publicRuntimeConfig.tagCount ) )
	}

	if ( Object.keys( publicRuntimeConfig.tagCount ).length < 1 ) {
		createTagCount( allCommunities );
	}


	return (
		<>
			<Main posts={ posts }/>
		</>
	)

}
