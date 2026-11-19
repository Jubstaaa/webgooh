import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

interface RichTextProps {
    className?: string
    data: SerializedEditorState
}

export function RichText({ className, data }: RichTextProps) {
    return (
        <LexicalRichText
            data={data}
            className={cn(
                'prose prose-invert-brand prose-headings:font-display prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl max-w-none',
                className
            )}
        />
    )
}
