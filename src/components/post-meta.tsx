import { Clock } from 'lucide-react'

import { formatDate } from '@/lib/utils'

interface PostMetaProps {
    minutes: number
    publishedAt: null | string | undefined
    // The card says "dk", the article header has room for "dk okuma".
    readingLabel: string
}

export function PostMeta({
    minutes,
    publishedAt,
    readingLabel,
}: PostMetaProps) {
    return (
        <span className="text-faint flex items-center gap-3 font-mono text-xs">
            {publishedAt ? (
                <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            ) : null}
            {minutes ? (
                <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {minutes} {readingLabel}
                </span>
            ) : null}
        </span>
    )
}
