import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from 'payload'

import type { Post } from '@payload-types'

import { cacheTags } from '@/lib/cache-tags'
import { safeRevalidatePath, safeRevalidateTag } from '@/lib/revalidate'

function revalidatePost(doc: Partial<Post>) {
    safeRevalidateTag(cacheTags.posts)
    safeRevalidateTag(cacheTags.sitemap)

    if (doc?.slug) {
        safeRevalidateTag(cacheTags.post(doc.slug))
        safeRevalidatePath(`/blog/${doc.slug}`)
    }

    const category =
        doc?.category && typeof doc.category === 'object'
            ? doc.category.slug
            : undefined

    if (category) safeRevalidateTag(cacheTags.category(category))
}

export const revalidatePostAfterChange: CollectionAfterChangeHook<Post> = ({
    doc,
    previousDoc,
}) => {
    if (doc._status === 'published') revalidatePost(doc)
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        revalidatePost(previousDoc)
    }

    return doc
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook<Post> = ({
    doc,
}) => {
    revalidatePost(doc)

    return doc
}
