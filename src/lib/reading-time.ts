import type { Post } from '@payload-types'

import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import readingTime from 'reading-time'

const WORDS_PER_MINUTE = 150

export function readingMinutes(content: null | Post['content'] | undefined) {
    if (!content?.root) return 0

    const { minutes } = readingTime(
        convertLexicalToPlaintext({ data: content }),
        {
            wordsPerMinute: WORDS_PER_MINUTE,
        }
    )

    return Math.max(1, Math.round(minutes))
}
