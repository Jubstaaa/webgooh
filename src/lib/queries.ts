import { unstable_cache } from 'next/cache'

import { cacheTags } from './cache-tags'
import { getPayloadClient } from './payload'

export const getSettings = unstable_cache(
    async () => {
        const payload = await getPayloadClient()

        return payload.findGlobal({ slug: 'site-settings' })
    },
    ['site-settings'],
    { tags: [cacheTags.settings] }
)

export const getServices = unstable_cache(
    async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
            collection: 'services',
            pagination: false,
            sort: 'order',
        })

        return docs
    },
    ['services'],
    { tags: [cacheTags.services] }
)

export const getServiceBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
                collection: 'services',
                limit: 1,
                where: { slug: { equals: slug } },
            })

            return docs[0] ?? null
        },
        ['service', slug],
        { tags: [cacheTags.services, cacheTags.service(slug)] }
    )()

export const getCategories = unstable_cache(
    async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
            collection: 'categories',
            pagination: false,
            sort: 'title',
        })

        return docs
    },
    ['categories'],
    { tags: [cacheTags.categories] }
)

interface PostQuery {
    categorySlug?: string
    // Omitted means every published post: the sitemap, RSS and static params
    // must not be silently cut off at Payload's default page size.
    limit?: number
}

export const getPosts = ({ categorySlug, limit }: PostQuery = {}) =>
    unstable_cache(
        async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
                collection: 'posts',
                depth: 1,
                ...(limit ? { limit } : { pagination: false }),
                sort: '-publishedAt',
                where: {
                    _status: { equals: 'published' },
                    ...(categorySlug
                        ? { 'category.slug': { equals: categorySlug } }
                        : {}),
                },
            })

            return docs
        },
        ['posts', categorySlug ?? 'all', String(limit ?? 'all')],
        {
            tags: [
                cacheTags.posts,
                ...(categorySlug ? [cacheTags.category(categorySlug)] : []),
            ],
        }
    )()

export const getPostBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
                collection: 'posts',
                depth: 2,
                limit: 1,
                where: {
                    _status: { equals: 'published' },
                    slug: { equals: slug },
                },
            })

            return docs[0] ?? null
        },
        ['post', slug],
        { tags: [cacheTags.posts, cacheTags.post(slug)] }
    )()

export const getProjects = unstable_cache(
    async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
            collection: 'projects',
            depth: 1,
            pagination: false,
            sort: 'order',
        })

        return docs
    },
    ['projects'],
    { tags: [cacheTags.projects] }
)

export const getProjectBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
                collection: 'projects',
                depth: 2,
                limit: 1,
                where: { slug: { equals: slug } },
            })

            return docs[0] ?? null
        },
        ['project', slug],
        { tags: [cacheTags.projects, cacheTags.project(slug)] }
    )()

export const getContentCounts = unstable_cache(
    async () => {
        const payload = await getPayloadClient()
        const [posts, services, projects, categories] = await Promise.all([
            payload.count({
                collection: 'posts',
                where: { _status: { equals: 'published' } },
            }),
            payload.count({ collection: 'services' }),
            payload.count({ collection: 'projects' }),
            payload.count({ collection: 'categories' }),
        ])

        return {
            categories: categories.totalDocs,
            posts: posts.totalDocs,
            projects: projects.totalDocs,
            services: services.totalDocs,
        }
    },
    ['content-counts'],
    {
        tags: [
            cacheTags.posts,
            cacheTags.services,
            cacheTags.projects,
            cacheTags.categories,
        ],
    }
)
