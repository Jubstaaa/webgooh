import { describe, expect, test } from 'bun:test'

import { formatDate, slugify } from '@/lib/utils'

describe('slugify', () => {
    test.each<[string, string]>([
        ['Çığ ÖĞRENCİ şüphe İzmir ı', 'cig-ogrenci-suphe-izmir-i'],
        [
            "Markaların %80'i Neden Başarısız?",
            'markalarin-80-i-neden-basarisiz',
        ],
        ['  --Ağ Güvenliği--  ', 'ag-guvenligi'],
        ['Ünlü ürün café', 'unlu-urun-cafe'],
        ['Next.js 16 & React 19', 'next-js-16-react-19'],
    ])('%p -> %p', (input, expected) => {
        expect(slugify(input)).toBe(expected)
    })
})

describe('formatDate', () => {
    test('formats in Turkish long form', () => {
        expect(formatDate('2026-11-19T12:00:00.000Z')).toBe('19 Kasım 2026')
    })
})
