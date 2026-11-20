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
import type { Post } from '@payload-types'

export function postTargets(doc: Partial<Post>): RevalidationTargets {
    const category =
        doc.category && typeof doc.category === 'object'
            ? doc.category.slug
            : undefined

    return {
        paths: doc.slug ? [`/blog/${doc.slug}`] : [],
        tags: [
            cacheTags.posts,
            ...(doc.slug ? [cacheTags.post(doc.slug)] : []),
            ...(category ? [cacheTags.category(category)] : []),
        ],
    }
}

// Either side being published means public pages may show the post: a
// publish adds it, an unpublish has to take it back off, and a published post
// that changes slug or category leaves the old page and category list stale.
export function postChangeTargets(
    doc: Partial<Post>,
    previousDoc?: Partial<Post>
): RevalidationTargets {
    const wasPublished = previousDoc?._status === 'published'
    if (doc._status !== 'published' && !wasPublished) return noTargets

    return mergeTargets(
        postTargets(doc),
        previousDoc ? postTargets(previousDoc) : noTargets
    )
}

export const revalidatePostAfterChange: CollectionAfterChangeHook<Post> = ({
    doc,
    previousDoc,
}) => {
    revalidateTargets(postChangeTargets(doc, previousDoc))

    return doc
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook<Post> = ({
    doc,
}) => {
    revalidateTargets(postTargets(doc))

    return doc
}
