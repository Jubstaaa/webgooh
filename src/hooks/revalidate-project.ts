import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from 'payload'

import type { Project } from '@payload-types'

import { cacheTags } from '@/lib/cache-tags'
import { safeRevalidatePath, safeRevalidateTag } from '@/lib/revalidate'

function revalidateProject(doc: Partial<Project>) {
    safeRevalidateTag(cacheTags.projects)
    safeRevalidateTag(cacheTags.sitemap)
    safeRevalidatePath('/referanslar')

    if (doc?.slug) {
        safeRevalidateTag(cacheTags.project(doc.slug))
        safeRevalidatePath(`/referanslar/${doc.slug}`)
    }
}

export const revalidateProjectAfterChange: CollectionAfterChangeHook<
    Project
> = ({ doc, previousDoc }) => {
    revalidateProject(doc)
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        revalidateProject(previousDoc)
    }

    return doc
}

export const revalidateProjectAfterDelete: CollectionAfterDeleteHook<
    Project
> = ({ doc }) => {
    revalidateProject(doc)

    return doc
}
