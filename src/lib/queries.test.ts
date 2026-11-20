import { afterEach, describe, expect, mock, test } from 'bun:test'

void mock.module('next/cache', () => ({
    revalidatePath: () => {},
    revalidateTag: () => {},
    unstable_cache: <T>(fn: T) => fn,
}))

const COUNTS: Record<string, number> = {
    categories: 4,
    posts: 37,
    projects: 6,
    services: 8,
}

const find = mock((_args: Record<string, unknown>) =>
    Promise.resolve({ docs: [] })
)
const count = mock(({ collection }: { collection: string }) =>
    Promise.resolve({ totalDocs: COUNTS[collection] ?? 0 })
)

void mock.module('@/lib/payload', () => ({
    getPayloadClient: () =>
        Promise.resolve({
            count,
            find,
            findGlobal: () => Promise.resolve({ whatsapp: '905000000000' }),
        }),
}))

const queries = await import('./queries')

afterEach(() => {
    find.mockClear()
    count.mockClear()
})

function lastFind() {
    return find.mock.calls.at(-1)?.[0]
}

describe('list queries behind the sitemap and RSS', () => {
    test('read every published post when no limit is given', async () => {
        await queries.getPosts()

        expect(lastFind()).toMatchObject({
            collection: 'posts',
            pagination: false,
        })
        expect(lastFind()).not.toHaveProperty('limit')
    })

    test('keep an explicit limit for teasers', async () => {
        await queries.getPosts({ limit: 3 })

        expect(lastFind()).toMatchObject({ limit: 3 })
        expect(lastFind()).not.toHaveProperty('pagination')
    })

    test.each(['getCategories', 'getProjects', 'getServices'] as const)(
        '%s is not capped',
        async name => {
            await queries[name]()

            expect(lastFind()).toMatchObject({ pagination: false })
        }
    )
})

describe('getContentCounts', () => {
    test('counts published posts and every other collection', async () => {
        expect(await queries.getContentCounts()).toEqual({
            categories: 4,
            posts: 37,
            projects: 6,
            services: 8,
        })
        expect(count).toHaveBeenCalledWith({
            collection: 'posts',
            where: { _status: { equals: 'published' } },
        })
    })
})

describe('single-document queries', () => {
    test('read the site settings global', async () => {
        expect(await queries.getSettings()).toMatchObject({
            whatsapp: '905000000000',
        })
    })

    test.each([
        ['getPostBySlug', 'posts'],
        ['getProjectBySlug', 'projects'],
        ['getServiceBySlug', 'services'],
    ] as const)(
        '%s looks the slug up and misses as null',
        async (name, collection) => {
            expect(await queries[name]('yok')).toBeNull()
            expect(lastFind()).toMatchObject({
                collection,
                limit: 1,
                where: { slug: { equals: 'yok' } },
            })
        }
    )

    test('a post page only finds published posts', async () => {
        await queries.getPostBySlug('taslak')

        expect(lastFind()).toMatchObject({
            where: { _status: { equals: 'published' } },
        })
    })
})
