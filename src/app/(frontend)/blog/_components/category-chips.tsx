import type { Category } from '@payload-types'

import Link from 'next/link'

import { cn } from '@/lib/utils'

interface CategoryChipsProps {
    activeSlug?: string | undefined
    categories: Category[]
}

export function CategoryChips({ activeSlug, categories }: CategoryChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <Link
                className={cn(
                    'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
                    !activeSlug
                        ? 'border-brand/50 bg-brand/15 text-brand-bright'
                        : 'border-line text-muted hover:text-paper'
                )}
                href="/blog">
                Tümü
            </Link>
            {categories.map(category => (
                <Link
                    className={cn(
                        'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
                        activeSlug === category.slug
                            ? 'border-brand/50 bg-brand/15 text-brand-bright'
                            : 'border-line text-muted hover:text-paper'
                    )}
                    href={`/blog/kategori/${category.slug}`}
                    key={category.id}>
                    {category.title}
                </Link>
            ))}
        </div>
    )
}
