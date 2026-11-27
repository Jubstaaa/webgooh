import { revalidatePath, revalidateTag } from 'next/cache'

export interface RevalidationTargets {
    expireNow?: boolean
    paths: string[]
    tags: string[]
}

export function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch (error) {
        console.error(`Revalidating path "${path}" failed`, error)
    }
}

export function safeRevalidateTag(tag: string, { expireNow = false } = {}) {
    try {
        revalidateTag(tag, expireNow ? { expire: 0 } : 'max')
    } catch (error) {
        console.error(`Revalidating tag "${tag}" failed`, error)
    }
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
    tags.forEach(tag => {
        safeRevalidateTag(tag, { expireNow })
    })
    paths.forEach(safeRevalidatePath)
}
