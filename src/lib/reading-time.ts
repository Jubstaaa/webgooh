import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import readingTime from 'reading-time'

import type { Post } from '@payload-types'

// The library defaults to 200 wpm, an English figure. Turkish words are longer
// and agglutinative, so 200 reads the archive as ~1 dk when a human editor had
// judged the same articles 2-3 dk; 150 lands back on that range.
const WORDS_PER_MINUTE = 150

export function readingMinutes(content: Post['content'] | null | undefined) {
    if (!content?.root) return 0

    const { minutes } = readingTime(
        convertLexicalToPlaintext({ data: content }),
        {
            wordsPerMinute: WORDS_PER_MINUTE,
        }
    )

    return Math.max(1, Math.round(minutes))
}
