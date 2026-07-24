import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function slugify(value: string) {
    const map: Record<string, string> = {
        ç: 'c',
        ğ: 'g',
        İ: 'i',
        ı: 'i',
        ö: 'o',
        ş: 's',
        ü: 'u',
    }

    return value
        .replace(/[çğıİöşü]/g, char => map[char] ?? char)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function formatDate(value: Date | string) {
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value))
}
