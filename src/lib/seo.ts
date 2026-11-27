import type { Metadata } from 'next'

import { type MediaLike, mediaUrl } from './media'

interface BuildMetadataArgs {
    description: string
    image?: MediaLike | undefined
    path: string
    seo?: null | SeoGroup | undefined
    title: string
}

interface SeoGroup {
    description?: null | string | undefined
    image?: MediaLike | undefined
    title?: null | string | undefined
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
    const ogImage = mediaUrl(seo?.image) || mediaUrl(image)

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
