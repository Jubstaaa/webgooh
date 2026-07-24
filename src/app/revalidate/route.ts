import { type NextRequest, NextResponse } from 'next/server'

import { safeRevalidatePath, safeRevalidateTag } from '@/lib/revalidate'

interface RevalidatePayload {
    paths?: string[]
    tags?: string[]
}

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-revalidate-secret')

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as RevalidatePayload

    for (const tag of body.tags ?? []) safeRevalidateTag(tag)
    for (const path of body.paths ?? []) safeRevalidatePath(path)

    return NextResponse.json({
        now: Date.now(),
        paths: body.paths ?? [],
        revalidated: true,
        tags: body.tags ?? [],
    })
}
