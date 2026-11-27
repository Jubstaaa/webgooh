import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function GET() {
    try {
        const payload = await getPayloadClient()
        const { totalDocs } = await payload.count({ collection: 'users' })

        if (process.env.HEALTH_REQUIRE_DATA === 'true' && totalDocs === 0) {
            throw new Error('The database has no users: wrong or empty file')
        }

        return Response.json({ status: 'ok' }, { headers: noStore })
    } catch (error) {
        console.error('Health check failed', error)

        return Response.json(
            { status: 'error' },
            { headers: noStore, status: 503 }
        )
    }
}
