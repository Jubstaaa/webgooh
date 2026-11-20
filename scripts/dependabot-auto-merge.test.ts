import { describe, expect, test } from 'bun:test'

import { decideAutoMerge } from './dependabot-auto-merge'

const safe = {
    dependencyNames: 'zod',
    ecosystem: 'bun',
    updateType: 'version-update:semver-minor',
}

describe('decideAutoMerge', () => {
    test('allows an explicit patch or minor update of a bun package', () => {
        expect(decideAutoMerge(safe)).toBe('safe')
        expect(
            decideAutoMerge({
                ...safe,
                updateType: 'version-update:semver-patch',
            })
        ).toBe('safe')
    })

    test('holds majors and unknown update types', () => {
        for (const updateType of ['version-update:semver-major', '', 'x']) {
            expect(decideAutoMerge({ ...safe, updateType })).toBe('review')
        }
    })

    test('holds GitHub Actions, Docker and unknown ecosystems', () => {
        for (const ecosystem of ['github_actions', 'docker', '', 'npm']) {
            expect(decideAutoMerge({ ...safe, ecosystem })).toBe('review')
        }
    })

    test('holds any Payload package, alone or inside a group', () => {
        for (const dependencyNames of [
            'payload',
            '@payloadcms/next',
            'zod, @payloadcms/db-sqlite',
            'zod,payload',
        ]) {
            expect(decideAutoMerge({ ...safe, dependencyNames })).toBe('review')
        }
    })

    test('holds a PR whose dependency list is empty', () => {
        expect(decideAutoMerge({ ...safe, dependencyNames: ' , ' })).toBe(
            'review'
        )
    })

    test('holds when the metadata is missing', () => {
        expect(decideAutoMerge({})).toBe('review')
    })
})
