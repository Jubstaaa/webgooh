import { type NextRequest, NextResponse } from 'next/server'

// Legacy slugs carried a literal "%" — a WordPress title like "markaların %80'i"
// became ...markalarin-%80i..., and inbound links still point there. To a URL
// parser that reads as an escape for byte 0x80, which is not valid UTF-8, so
// Next throws a URIError while decoding the route param. That happens in the
// routing layer, before any page renders: error.tsx and not-found.tsx never see
// it and the visitor gets a bare "Internal Server Error" instead of a 404.
//
// The migration's slugify dropped the "%", so the post those links were meant
// for exists under the same slug minus that character. Repairing the path and
// redirecting therefore lands on the real article rather than a dead end, and a
// slug that genuinely does not exist falls through to the normal 404.
function repairEscapes(pathname: string) {
    // Consecutive escapes are decoded as one run: a multi-byte character like
    // %C3%A7 is only valid together, so testing each escape alone would reject
    // half of the Turkish slugs on the site.
    return pathname.replace(/(?:%[0-9A-Fa-f]{2})+/g, run => {
        try {
            decodeURIComponent(run)

            return run
        } catch {
            return run.replaceAll('%', '')
        }
    })
}

function decodes(value: string) {
    try {
        decodeURIComponent(value)

        return true
    } catch {
        return false
    }
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!pathname.includes('%') || decodes(pathname)) return NextResponse.next()

    const repaired = repairEscapes(pathname)

    if (repaired !== pathname && decodes(repaired)) {
        const url = request.nextUrl.clone()
        url.pathname = repaired

        return NextResponse.redirect(url, 301)
    }

    // Nothing salvageable — still answer 404 rather than 500, so crawlers stop
    // treating these as server faults.
    return new NextResponse('Not Found', { status: 404 })
}

export const config = {
    matcher: ['/((?!_next/static|_next/image).*)'],
}
