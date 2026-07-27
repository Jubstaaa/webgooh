import readingTime from 'reading-time'

interface LexicalNode {
    children?: LexicalNode[]
    text?: string
}

// Lexical stores the body as a node tree, so the words live in the `text` leaves.
function collectText(node: LexicalNode): string {
    if (typeof node.text === 'string') return node.text
    if (!node.children) return ''

    return node.children.map(collectText).join(' ')
}

// The library defaults to 200 wpm, an English figure. Turkish words are longer
// and agglutinative, so 200 reads the archive as ~1 dk when a human editor had
// judged the same articles 2-3 dk; 150 lands back on that range.
const WORDS_PER_MINUTE = 150

export function readingMinutes(content: unknown) {
    const root = (content as { root?: LexicalNode } | null)?.root

    if (!root) return 0

    const { minutes } = readingTime(collectText(root), {
        wordsPerMinute: WORDS_PER_MINUTE,
    })

    return Math.max(1, Math.round(minutes))
}
