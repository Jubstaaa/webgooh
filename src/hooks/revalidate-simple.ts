import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    GlobalAfterChangeHook,
} from 'payload'

import { safeRevalidateTag } from '@/lib/revalidate'

export function revalidateCollection(tag: string) {
    const afterChange: CollectionAfterChangeHook = ({ doc }) => {
        safeRevalidateTag(tag)

        return doc
    }

    const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
        safeRevalidateTag(tag)

        return doc
    }

    return { afterChange, afterDelete }
}

export function revalidateGlobal(tag: string): GlobalAfterChangeHook {
    return ({ doc }) => {
        safeRevalidateTag(tag)

        return doc
    }
}
