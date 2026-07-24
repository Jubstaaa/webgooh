import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import type { Category } from '@payload-types'

import { getPostBySlug, getPosts } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { BlogDetail } from '@/views/blog/blog-detail'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const posts = await getPosts()

    return posts
        .filter(post => Boolean(post.slug))
        .map(post => ({ slug: post.slug as string }))
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) return {}

    return buildMetadata({
        description: post.excerpt,
        image: post.coverImage,
        path: `/blog/${slug}`,
        seo: post.seo,
        title: post.title,
    })
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) notFound()

    const category =
        typeof post.category === 'object' ? (post.category as Category) : null
    const categorySlug = category?.slug ?? undefined

    const relatedAll = await getPosts({ categorySlug, limit: 4 })
    const related = relatedAll.filter(item => item.id !== post.id).slice(0, 3)

    return <BlogDetail post={post} related={related} />
}
