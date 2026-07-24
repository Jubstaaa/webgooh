import Link from 'next/link'

import type { Category } from '@payload-types'

import { cn } from '@/lib/utils'

interface CategoryChipsProps {
    activeSlug?: string
    categories: Category[]
}

export function CategoryChips({ activeSlug, categories }: CategoryChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <Link
                href="/blog"
                className={cn(
                    'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
                    !activeSlug
                        ? 'border-brand/50 bg-brand/15 text-brand-bright'
                        : 'border-line text-muted hover:text-paper'
                )}>
                Tümü
            </Link>
            {categories.map(category => (
                <Link
                    key={category.id}
                    href={`/blog/kategori/${category.slug}`}
                    className={cn(
                        'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
                        activeSlug === category.slug
                            ? 'border-brand/50 bg-brand/15 text-brand-bright'
                            : 'border-line text-muted hover:text-paper'
                    )}>
                    {category.title}
                </Link>
            ))}
        </div>
    )
}
