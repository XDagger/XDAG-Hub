import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allDApps } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import GithubSlugger from "github-slugger";

import { writeFileSync } from 'fs'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Dapp' })

export default function DAppPage() {
  const dapps = allCoreContent(sortPosts(allDApps))
  const pageNumber = 1
  const initialDisplayPosts = dapps.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(dapps.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={dapps}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Apps"
    />
  )
}
