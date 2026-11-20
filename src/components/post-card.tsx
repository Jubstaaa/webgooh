import Image from 'next/image'
import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { mediaAlt, mediaUrl } from '@/lib/media'
import { readingMinutes } from '@/lib/reading-time'
import type { Post } from '@payload-types'

import { Badge } from './badge'
import { PostMeta } from './post-meta'

interface PostCardProps {
    // Above-the-fold cards load their image eagerly and at high priority.
    eager?: boolean
    // h2 when the card list sits directly under the page's h1.
    headingLevel?: 'h2' | 'h3'
    post: Post
}

export function PostCard({
    eager = false,
    headingLevel: Heading = 'h3',
    post,
}: PostCardProps) {
    const cat = typeof post.category === 'object' ? post.category : null
    const cover = mediaUrl(post.coverImage)
    const minutes = readingMinutes(post.content)

    return (
        <Link
            className="card-surface group hover:border-brand/50 relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
            href={`/blog/${post.slug}`}>
            <div className="bg-surface-2 relative aspect-[16/10] overflow-hidden">
                {cover ? (
                    <Image
                        fill
                        alt={mediaAlt(post.coverImage, post.title)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fetchPriority={eager ? 'high' : 'auto'}
                        loading={eager ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 400px"
                        src={cover}
                    />
                ) : null}
                <div className="from-ink/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                {cat ? (
                    <Badge className="absolute top-4 left-4" color={cat.color}>
                        {cat.title}
                    </Badge>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <PostMeta
                    minutes={minutes}
                    publishedAt={post.publishedAt}
                    readingLabel="dk"
                />

                <Heading className="text-paper group-hover:text-brand-bright line-clamp-2 text-lg leading-snug font-semibold transition-colors">
                    {post.title}
                </Heading>

                <p className="text-muted line-clamp-2 text-sm leading-relaxed">
                    {post.excerpt}
                </p>

                <span className="text-accent mt-auto inline-flex items-center gap-1 pt-2 font-mono text-xs">
                    Devamını oku
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </Link>
    )
}
