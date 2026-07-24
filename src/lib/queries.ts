import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { getPayloadClient } from '@/lib/payload'

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
            limit: 50,
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
            limit: 100,
            sort: 'title',
        })

        return docs
    },
    ['categories'],
    { tags: [cacheTags.categories] }
)

interface PostQuery {
    categorySlug?: string
    limit?: number
}

export const getPosts = ({ categorySlug, limit = 100 }: PostQuery = {}) =>
    unstable_cache(
        async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
                collection: 'posts',
                depth: 1,
                limit,
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
        ['posts', categorySlug ?? 'all', String(limit)],
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
            limit: 100,
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
