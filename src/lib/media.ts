import type { Media } from '@payload-types'

export type MediaLike = Media | null | number | undefined

export function mediaAlt(value: MediaLike, fallback = '') {
    return resolveMedia(value)?.alt ?? fallback
}

export function mediaUrl(value: MediaLike) {
    return resolveMedia(value)?.url ?? null
}

function resolveMedia(value: MediaLike) {
    if (!value || typeof value === 'number') return null

    return value
}
