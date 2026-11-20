import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogDetail } from '@/app/(frontend)/blog/_components/blog-detail'
import { getPostBySlug, getPosts } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const posts = await getPosts()

    return posts.flatMap(post => (post.slug ? [{ slug: post.slug }] : []))
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
        title: post.title,
    })
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) notFound()

    const category = typeof post.category === 'object' ? post.category : null
    const categorySlug = category?.slug ?? undefined

    const relatedAll = await getPosts({ categorySlug, limit: 4 })
    const related = relatedAll.filter(item => item.id !== post.id).slice(0, 3)

    return <BlogDetail post={post} related={related} />
}
