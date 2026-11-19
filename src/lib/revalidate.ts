import { revalidatePath, revalidateTag } from 'next/cache'

// Called from Payload hooks. A failure must not fail the editor's save, since
// the content itself is already written, but it does leave pages stale, so it
// is logged rather than swallowed.
export function safeRevalidateTag(tag: string) {
    try {
        revalidateTag(tag, 'max')
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
