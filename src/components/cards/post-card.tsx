import Image from 'next/image'
import Link from 'next/link'

import { ArrowUpRight, Clock } from 'lucide-react'

import type { Category, Post } from '@payload-types'

import { Badge } from '@/components/ui/badge'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
    post: Post
    priority?: boolean
}

export function PostCard({ post, priority = false }: PostCardProps) {
    const cat =
        typeof post.category === 'object' ? (post.category as Category) : null
    const cover = mediaUrl(post.coverImage)

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
                        priority={priority}
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
                <div className="text-faint flex items-center gap-3 font-mono text-xs">
                    {post.publishedAt ? (
                        <time dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                        </time>
                    ) : null}
                    {post.readingMinutes ? (
                        <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {post.readingMinutes} dk
                        </span>
                    ) : null}
                </div>

                <h3 className="text-paper group-hover:text-brand-bright line-clamp-2 text-lg leading-snug font-semibold transition-colors">
                    {post.title}
                </h3>

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
