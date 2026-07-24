import type { Metadata } from 'next'

import { type MediaLike, mediaUrl } from '@/lib/media'

interface SeoGroup {
    description?: string | null
    image?: MediaLike
    title?: string | null
}

interface BuildMetadataArgs {
    description: string
    image?: MediaLike
    path: string
    seo?: SeoGroup | null
    title: string
}

export function buildMetadata({
    description,
    image,
    path,
    seo,
    title,
}: BuildMetadataArgs): Metadata {
    const metaTitle = seo?.title || title
    const metaDescription = seo?.description || description
    const ogImage =
        mediaUrl(seo?.image, 'feature') || mediaUrl(image, 'feature')

    return {
        alternates: { canonical: path },
        description: metaDescription,
        openGraph: {
            description: metaDescription,
            images: ogImage ? [{ url: ogImage }] : undefined,
            title: metaTitle,
            url: path,
        },
        title: metaTitle,
        twitter: {
            card: 'summary_large_image',
            description: metaDescription,
            images: ogImage ? [ogImage] : undefined,
            title: metaTitle,
        },
    }
}
