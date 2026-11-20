import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from 'payload'

import { cacheTags } from '@/lib/cache-tags'
import {
    mergeTargets,
    noTargets,
    type RevalidationTargets,
    revalidateTargets,
} from '@/lib/revalidate'
import type { Category } from '@payload-types'

// Posts embed their category (name, colour) under the posts and post:<slug>
// tags, so a category edit has to refresh those too, not just the list.
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

export function categoryChangeTargets(
    doc: Partial<Category>,
    previousDoc?: Partial<Category>
): RevalidationTargets {
    return mergeTargets(
        categoryTargets(doc),
        previousDoc ? categoryTargets(previousDoc) : noTargets
    )
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
