import type { Category } from '@payload-types'
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from 'payload'

import { cacheTags } from '@/lib/cache-tags'
import {
    mergeTargets,
    noTargets,
    revalidateTargets,
    type RevalidationTargets,
} from '@/lib/revalidate'

export function categoryChangeTargets(
    doc: Partial<Category>,
    previousDoc?: Partial<Category>
): RevalidationTargets {
    return mergeTargets(
        categoryTargets(doc),
        previousDoc ? categoryTargets(previousDoc) : noTargets
    )
}

export function categoryTargets(doc: Partial<Category>): RevalidationTargets {
    return {
        paths: [],
        tags: [
            cacheTags.categories,
            cacheTags.posts,
            ...(doc.slug ? [cacheTags.category(doc.slug)] : []),
        ],
    }
}

export const revalidateCategoryAfterChange: CollectionAfterChangeHook<
    Category
> = ({ doc, previousDoc }) => {
    revalidateTargets(categoryChangeTargets(doc, previousDoc))

    return doc
}

export const revalidateCategoryAfterDelete: CollectionAfterDeleteHook<
    Category
> = ({ doc }) => {
    revalidateTargets(categoryTargets(doc))

    return doc
}
