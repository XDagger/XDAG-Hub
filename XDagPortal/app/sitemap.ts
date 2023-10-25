import { MetadataRoute } from 'next'
import { allDApps } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const blogRoutes = allDApps.map((dapp) => ({
    url: `${siteUrl}/${dapp.path}`,
    lastModified: dapp.lastMod || dapp.date,
  }))

  const routes = ['', 'dapp', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
