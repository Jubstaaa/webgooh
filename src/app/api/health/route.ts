import { getPayloadClient } from '@/lib/payload'

// The container healthcheck and the deploy's health gate both call this. Every
// page is served from Next's cache, so they can answer while Payload cannot
// open or read the database; this route runs a real query on every request.
export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function GET() {
    try {
        const payload = await getPayloadClient()
        await payload.count({ collection: 'categories' })

        return Response.json({ status: 'ok' }, { headers: noStore })
    } catch (error) {
        console.error('Health check failed', error)

        return Response.json(
            { status: 'error' },
            { headers: noStore, status: 503 }
        )
    }
}
