import type { MetadataRoute } from 'next'

import {
    getCategories,
    getPosts,
    getProjects,
    getServices,
} from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, services, categories, projects] = await Promise.all([
        getPosts(),
        getServices(),
        getCategories(),
        getProjects(),
    ])

    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/hizmetlerimiz',
        '/referanslar',
        '/blog',
        '/hakkimizda',
        '/iletisim',
    ].map(path => ({
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
        url: `${SITE_URL}${path}`,
    }))

    const serviceRoutes: MetadataRoute.Sitemap = services
        .filter(service => service.slug)
        .map(service => ({
            changeFrequency: 'monthly',
            priority: 0.6,
            url: `${SITE_URL}/hizmetlerimiz/${service.slug}`,
        }))

    const postRoutes: MetadataRoute.Sitemap = posts
        .filter(post => post.slug)
        .map(post => ({
            changeFrequency: 'monthly',
            lastModified: post.updatedAt,
            priority: 0.5,
            url: `${SITE_URL}/blog/${post.slug}`,
        }))

    const categoryRoutes: MetadataRoute.Sitemap = categories
        .filter(category => category.slug)
        .map(category => ({
            changeFrequency: 'weekly',
            priority: 0.4,
            url: `${SITE_URL}/blog/kategori/${category.slug}`,
        }))

    const projectRoutes: MetadataRoute.Sitemap = projects
        .filter(project => project.slug)
        .map(project => ({
            changeFrequency: 'monthly',
            priority: 0.6,
            url: `${SITE_URL}/referanslar/${project.slug}`,
        }))

    return [
        ...staticRoutes,
        ...serviceRoutes,
        ...postRoutes,
        ...categoryRoutes,
        ...projectRoutes,
    ]
}
