import type { GlobalAfterChangeHook } from 'payload'

import { safeRevalidateTag } from '@/lib/revalidate'

export function revalidateGlobal(tag: string): GlobalAfterChangeHook {
    return ({ doc }) => {
        safeRevalidateTag(tag)

        return doc
    }
}
