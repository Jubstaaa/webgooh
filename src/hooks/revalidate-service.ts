import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from 'payload'

import type { Service } from '@payload-types'

import { cacheTags } from '@/lib/cache-tags'
import { safeRevalidatePath, safeRevalidateTag } from '@/lib/revalidate'

function revalidateService(doc: Partial<Service>) {
    safeRevalidateTag(cacheTags.services)
    safeRevalidateTag(cacheTags.sitemap)
    safeRevalidatePath('/')

    if (doc?.slug) {
        safeRevalidateTag(cacheTags.service(doc.slug))
        safeRevalidatePath(`/hizmetlerimiz/${doc.slug}`)
    }
}

export const revalidateServiceAfterChange: CollectionAfterChangeHook<
    Service
> = ({ doc, previousDoc }) => {
    revalidateService(doc)
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        revalidateService(previousDoc)
    }

    return doc
}

export const revalidateServiceAfterDelete: CollectionAfterDeleteHook<
    Service
> = ({ doc }) => {
    revalidateService(doc)

    return doc
}
