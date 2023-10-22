import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allDApps, allCommunities } from 'contentlayer/generated'
import Main from './Main'
import GithubSlugger from "github-slugger";
import { writeFileSync } from 'fs'

// let tagCount = undefined as any;
let tagCount: Record<string, number> = undefined;

export default async function Page() {

	const sortedPosts = sortPosts( allDApps ?? [] )
	const posts = allCoreContent( sortedPosts )

	/**
	 * Count the occurrences of all tags across blog posts and write to json file
	 */
	const createTagCount= ( allApps )=> {
		// const tagCount: Record<string, number> = {}
		tagCount = {};
		allApps.forEach( ( file ) => {
				if ( file.tags && (file.draft !== true) ) {
					file.tags.forEach( ( tag ) => {
						const formattedTag = GithubSlugger.slug( tag )
						if ( formattedTag in tagCount ) {
							tagCount[ formattedTag ] += 1
						} else {
							tagCount[ formattedTag ] = 1
						}
					} )
				}
			}
		)

		console.log('.............',tagCount)
		writeFileSync( './app/tag-data.json', JSON.stringify( tagCount ) )
	}

	if( !tagCount ){
		createTagCount(allCommunities);
	}



	return (
		<>
			<Main posts={ posts }/>
		</>
	)

}
