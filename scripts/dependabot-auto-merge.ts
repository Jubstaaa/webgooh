interface Metadata {
    dependencyNames?: string | undefined
    ecosystem?: string | undefined
    updateType?: string | undefined
}

const SAFE_UPDATE_TYPES = new Set([
    'version-update:semver-minor',
    'version-update:semver-patch',
])

const SAFE_ECOSYSTEMS = new Set(['bun'])

const isHeldPackage = (name: string) =>
    name === 'payload' || name.startsWith('@payloadcms/')

export function decideAutoMerge({
    dependencyNames = '',
    ecosystem = '',
    updateType = '',
}: Metadata): 'review' | 'safe' {
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
