import { revalidatePath, revalidateTag } from 'next/cache'

// Called from Payload hooks. A failure must not fail the editor's save, since
// the content itself is already written, but it does leave pages stale, so it
// is logged rather than swallowed.
export function safeRevalidateTag(tag: string, { expireNow = false } = {}) {
    try {
        revalidateTag(tag, expireNow ? { expire: 0 } : 'max')
    } catch (error) {
        console.error(`Revalidating tag "${tag}" failed`, error)
    }
}

export function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch (error) {
        console.error(`Revalidating path "${path}" failed`, error)
    }
}

export interface RevalidationTargets {
    // 'max' serves the old page while it rebuilds, which is right for an edit.
    // Taking content down has to be immediate: { expire: 0 } makes the next
    // request rebuild, so a removed post already 404s.
    expireNow?: boolean
    paths: string[]
    tags: string[]
}

export const noTargets: RevalidationTargets = { paths: [], tags: [] }

export function mergeTargets(
    ...targets: RevalidationTargets[]
): RevalidationTargets {
    return {
        ...(targets.some(target => target.expireNow)
            ? { expireNow: true }
            : {}),
        paths: [...new Set(targets.flatMap(target => target.paths))],
        tags: [...new Set(targets.flatMap(target => target.tags))],
    }
}

export function revalidateTargets({
    expireNow = false,
    paths,
    tags,
}: RevalidationTargets) {
    tags.forEach(tag => safeRevalidateTag(tag, { expireNow }))
    paths.forEach(safeRevalidatePath)
}
