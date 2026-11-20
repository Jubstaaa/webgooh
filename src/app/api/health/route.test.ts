import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test'

let count: (collection: string) => Promise<{ totalDocs: number }> = () =>
    Promise.resolve({ totalDocs: 3 })

void mock.module('@/lib/payload', () => ({
    getPayloadClient: () =>
        Promise.resolve({
            count: ({ collection }: { collection: string }) =>
                count(collection),
        }),
}))

const { dynamic, GET } = await import('./route')

describe('GET /api/health', () => {
    afterEach(() => {
        count = () => Promise.resolve({ totalDocs: 3 })
        delete process.env.HEALTH_REQUIRE_DATA
    })

    test('answers 200 when the database can be queried', async () => {
        const response = await GET()

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({ status: 'ok' })
        expect(response.headers.get('cache-control')).toBe('no-store')
    })

    test('answers 503 and logs the cause when the query fails', async () => {
        const failure = new Error('SQLITE_CORRUPT')
        count = () => Promise.reject(failure)
        const log = spyOn(console, 'error').mockImplementation(() => {})

        const response = await GET()

        expect(response.status).toBe(503)
        expect(await response.json()).toEqual({ status: 'error' })
        expect(log).toHaveBeenCalledWith('Health check failed', failure)
        log.mockRestore()
    })

    test('answers 503 for an empty database when data is required', async () => {
        // A missing or wrongly mounted database file is created empty and
        // migrated at boot; production must not report that as healthy.
        process.env.HEALTH_REQUIRE_DATA = 'true'
        count = () => Promise.resolve({ totalDocs: 0 })
        const log = spyOn(console, 'error').mockImplementation(() => {})

        const response = await GET()

        expect(response.status).toBe(503)
        log.mockRestore()
    })

    test('accepts an empty database when data is not required', async () => {
        count = () => Promise.resolve({ totalDocs: 0 })

        const response = await GET()

        expect(response.status).toBe(200)
    })

    test('is never prerendered or cached', () => {
        expect(dynamic).toBe('force-dynamic')
    })
})
