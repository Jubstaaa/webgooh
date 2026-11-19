import { describe, expect, test } from 'bun:test'

import { readingMinutes } from '@/lib/reading-time'
import type { Post } from '@payload-types'

function lexical(...paragraphs: string[]): Post['content'] {
    return {
        root: {
            children: paragraphs.map(text => ({
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text,
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            })),
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    }
}

const words = (count: number) =>
    Array.from({ length: count }, () => 'kelime').join(' ')

describe('readingMinutes', () => {
    test('is 0 without content', () => {
        expect(readingMinutes(null)).toBe(0)
        expect(readingMinutes(undefined)).toBe(0)
    })

    test('never reads shorter than a minute', () => {
        expect(readingMinutes(lexical('kısa bir yazı'))).toBe(1)
    })

    test('counts words across paragraphs at 150 wpm', () => {
        expect(readingMinutes(lexical(words(300), words(150)))).toBe(3)
    })
})
