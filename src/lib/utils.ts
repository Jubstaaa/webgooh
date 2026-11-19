import slugifyText from '@sindresorhus/slugify'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Turkish locale so ü/ö/ç become u/o/c (not the German ue/oe); "&" is dropped
// rather than spelled "and" on a Turkish site.
export function slugify(value: string) {
    return slugifyText(value, {
        customReplacements: [['&', ' ']],
        locale: 'tr',
    })
}

const dateFormat = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

export function formatDate(value: Date | string) {
    return dateFormat.format(new Date(value))
}
