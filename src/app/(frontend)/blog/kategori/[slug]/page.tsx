import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { getCategories } from '@/lib/queries'
import { Blog } from '@/views/blog/blog'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const categories = await getCategories()

    return categories
        .filter(category => Boolean(category.slug))
        .map(category => ({ slug: category.slug as string }))
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params
    const categories = await getCategories()
    const category = categories.find(item => item.slug === slug)

    if (!category) return {}

    return {
        alternates: { canonical: `/blog/kategori/${slug}` },
        description:
            category.description ??
            `${category.title} kategorisindeki tüm blog yazıları.`,
        title: `${category.title} Yazıları`,
    }
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params
    const categories = await getCategories()
    const category = categories.find(item => item.slug === slug)

    if (!category) notFound()

    return <Blog categorySlug={slug} />
}
