import type { Post } from '@payload-types'
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

export function postChangeTargets(
    doc: Partial<Post>,
    previousDoc?: Partial<Post>
): RevalidationTargets {
    const isPublished = doc._status === 'published'
    const wasPublished = previousDoc?._status === 'published'
    if (!isPublished && !wasPublished) return noTargets

    return mergeTargets(
        { ...postTargets(doc), ...(isPublished ? {} : { expireNow: true }) },
        previousDoc ? postTargets(previousDoc) : noTargets
    )
}

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
    revalidateTargets({ ...postTargets(doc), expireNow: true })

    return doc
}
