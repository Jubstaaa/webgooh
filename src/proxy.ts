import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!pathname.includes('%') || decodes(pathname)) return NextResponse.next()

    const repaired = repairEscapes(pathname)

    if (repaired !== pathname && decodes(repaired)) {
        const url = request.nextUrl.clone()
        url.pathname = repaired

        return NextResponse.redirect(url, 301)
    }

    return new NextResponse('Not Found', { status: 404 })
}

function decodes(value: string) {
    try {
        decodeURIComponent(value)

        return true
    } catch {
        return false
    }
}

function repairEscapes(pathname: string) {
    return pathname.replace(/(?:%[0-9A-Fa-f]{2})+/g, run => {
        try {
            decodeURIComponent(run)

            return run
        } catch {
            return run.replaceAll('%', '')
        }
    })
}

export const config = {
    matcher: ['/((?!_next/static|_next/image).*)'],
}
