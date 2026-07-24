import { revalidatePath, revalidateTag } from 'next/cache'

export function safeRevalidateTag(tag: string) {
    try {
        revalidateTag(tag, 'max')
    } catch {
        // Outside a Next.js request scope (e.g. seed scripts) — safe to ignore.
    }
}

export function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Outside a Next.js request scope (e.g. seed scripts) — safe to ignore.
    }
}
