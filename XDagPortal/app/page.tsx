import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allDApps } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {

	const sortedPosts = sortPosts( allDApps ?? [] )
	const posts = allCoreContent( sortedPosts )

	return (
		<>
			<Main posts={ posts }/>
		</>
	)

}
