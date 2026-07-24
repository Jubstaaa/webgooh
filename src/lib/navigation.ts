export interface NavItem {
    href: string
    label: string
}

export const mainNav: NavItem[] = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/hizmetlerimiz', label: 'Hizmetler' },
    { href: '/referanslar', label: 'Referanslar' },
    { href: '/blog', label: 'Blog' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
]

export const SITE_NAME = 'Webgooh'
export const SITE_TAGLINE = 'Webin yeni tanımı'
