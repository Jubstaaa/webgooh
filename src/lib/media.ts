import type { Media } from '@payload-types'

export type MediaLike = Media | number | null | undefined

export function resolveMedia(value: MediaLike) {
    if (!value || typeof value === 'number') return null

    return value
}

// Media is stored original-only; next/image derives the variants it needs and
// caches them, so there are no Payload imageSizes to pick from here.
export function mediaUrl(value: MediaLike) {
    return resolveMedia(value)?.url ?? null
}

export function mediaAlt(value: MediaLike, fallback = '') {
    return resolveMedia(value)?.alt ?? fallback
}
