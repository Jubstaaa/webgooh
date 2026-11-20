import { PHASE_PRODUCTION_SERVER } from 'next/constants.js'

import { describe, expect, test } from 'bun:test'

import config from './next.config.mjs'

interface HeaderRule {
    headers: { key: string; value: string }[]
    source: string
}

async function headerRules() {
    const nextConfig = config(PHASE_PRODUCTION_SERVER)
    if (!nextConfig.headers) throw new Error('next.config has no headers()')

    return (await nextConfig.headers()) as HeaderRule[]
}

function sourcesSetting(rules: HeaderRule[], key: string) {
    return rules
        .filter(rule => rule.headers.some(header => header.key === key))
        .map(rule => rule.source)
}

describe('next.config headers', () => {
    test('asks for colour-scheme client hints on the admin panel only', async () => {
        const rules = await headerRules()

        for (const key of ['Accept-CH', 'Critical-CH', 'Vary']) {
            expect(sourcesSetting(rules, key)).toEqual(['/admin/:path*'])
        }
    })

    test('keeps the security headers on every path', async () => {
        const rules = await headerRules()

        expect(sourcesSetting(rules, 'Content-Security-Policy')).toEqual([
            '/:path*',
        ])
    })
})
