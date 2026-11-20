// Decides whether a Dependabot PR may merge on its own once the required checks
// pass. Fails closed: only an explicit 'safe' allows it, and the workflow treats
// anything else (including the CLI crashing) as "needs a human". The workflow
// runs scripts/dependabot-auto-merge-cli.ts, which reads fetch-metadata's outputs.

interface Metadata {
    dependencyNames?: string
    ecosystem?: string
    updateType?: string
}

const SAFE_UPDATE_TYPES = new Set([
    'version-update:semver-minor',
    'version-update:semver-patch',
])

// GitHub Actions and the Docker base images run inside the deploy, next to its
// secrets, so they always wait for a human.
const SAFE_ECOSYSTEMS = new Set(['bun'])

// Even a Payload minor can expect a schema change that needs a migration.
const isHeldPackage = (name: string) =>
    name === 'payload' || name.startsWith('@payloadcms/')

export function decideAutoMerge({
    dependencyNames = '',
    ecosystem = '',
    updateType = '',
}: Metadata): 'review' | 'safe' {
    // Grouped PRs list every package, comma-separated.
    const names = dependencyNames
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)

    const safe =
        SAFE_UPDATE_TYPES.has(updateType) &&
        SAFE_ECOSYSTEMS.has(ecosystem) &&
        names.length > 0 &&
        !names.some(isHeldPackage)

    return safe ? 'safe' : 'review'
}
