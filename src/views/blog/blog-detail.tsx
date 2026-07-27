import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft, Clock } from 'lucide-react'

import type { Category, Post } from '@payload-types'

import { PostCard } from '@/components/cards/post-card'
import { JsonLd } from '@/components/seo/json-ld'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@/components/ui/rich-text'
import { SectionHeading } from '@/components/ui/section-heading'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { readingMinutes } from '@/lib/reading-time'
import { formatDate } from '@/lib/utils'

interface BlogDetailProps {
    post: Post
    related: Post[]
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'
const AUTHOR = 'Webgooh'

export function BlogDetail({ post, related }: BlogDetailProps) {
    const cat =
        typeof post.category === 'object' ? (post.category as Category) : null
    const cover = mediaUrl(post.coverImage)
    const minutes = readingMinutes(post.content)

    return (
        <article className="flex flex-col gap-16 pb-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    'author': {
                        '@type': 'Organization',
                        'name': AUTHOR,
                    },
                    'datePublished': post.publishedAt,
                    'description': post.excerpt,
                    'headline': post.title,
                    'image': cover ? `${SITE_URL}${cover}` : undefined,
                    'mainEntityOfPage': `${SITE_URL}/blog/${post.slug}`,
                    'publisher': { '@type': 'Organization', 'name': 'Webgooh' },
                }}
            />

            <header className="border-line relative overflow-hidden border-b pt-14 pb-12">
                <div
                    aria-hidden
                    className="grid-backdrop absolute inset-0 -z-10"
                />
                <div className="container-x flex flex-col gap-6">
                    <Link
                        className="text-muted hover:text-paper inline-flex w-fit items-center gap-1 font-mono text-xs transition-colors"
                        href="/blog">
                        <ArrowLeft className="size-3.5" /> Blog’a dön
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        {cat ? (
                            <Badge color={cat.color}>{cat.title}</Badge>
                        ) : null}
                        <span className="text-faint flex items-center gap-3 font-mono text-xs">
                            {post.publishedAt ? (
                                <time dateTime={post.publishedAt}>
                                    {formatDate(post.publishedAt)}
                                </time>
                            ) : null}
                            {minutes ? (
                                <span className="flex items-center gap-1">
                                    <Clock className="size-3" /> {minutes} dk
                                    okuma
                                </span>
                            ) : null}
                        </span>
                    </div>
                    <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                        {post.title}
                    </h1>
                </div>
            </header>

            <div className="container-x">
                {cover ? (
                    <div className="relative mx-auto aspect-[16/9] overflow-hidden rounded-2xl">
                        <Image
                            fill
                            priority
                            alt={mediaAlt(post.coverImage, post.title)}
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 896px"
                            src={cover}
                        />
                    </div>
                ) : null}
            </div>

            <div className="container-x mx-auto">
                <RichText data={post.content} />
            </div>

            {related.length ? (
                <section className="container-x flex flex-col gap-10">
                    <SectionHeading eyebrow="devamı" title="İlgili yazılar" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map(item => (
                            <PostCard key={item.id} post={item} />
                        ))}
                    </div>
                </section>
            ) : null}
        </article>
    )
}
