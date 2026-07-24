import type { Media } from '@payload-types'

export type MediaLike = Media | number | null | undefined

type MediaSize = 'thumbnail' | 'card' | 'feature'

export function resolveMedia(value: MediaLike) {
    if (!value || typeof value === 'number') return null

    return value
}

export function mediaUrl(value: MediaLike, size?: MediaSize) {
    const media = resolveMedia(value)

    if (!media) return null

    if (size) {
        const sized = media.sizes?.[size]
        if (sized?.url) return sized.url
    }

    return media.url ?? null
}

export function mediaAlt(value: MediaLike, fallback = '') {
    return resolveMedia(value)?.alt ?? fallback
}
