'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ButtonLink } from '@/components/button'
import { cn } from '@/lib/utils'

import { Logo } from './logo'
import { mainNav } from './navigation'

export function Header() {
    const pathname = usePathname()

    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 12)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    const closeMenu = () => {
        setOpen(false)
    }

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-300',
                scrolled
                    ? 'border-line bg-ink/80 border-b backdrop-blur-xl'
                    : 'border-b border-transparent'
            )}>
            <div className="container-x flex h-16 items-center justify-between">
                <Logo />

                <nav className="hidden items-center gap-1 md:flex">
                    {mainNav.map(item => (
                        <Link
                            className={cn(
                                'rounded-full px-4 py-2 text-sm transition-colors',
                                isActive(item.href)
                                    ? 'text-paper'
                                    : 'text-muted hover:text-paper'
                            )}
                            href={item.href}
                            key={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <ButtonLink href="/iletisim" size="sm">
                        Teklif Al
                    </ButtonLink>
                </div>

                <button
                    aria-controls="mobile-menu"
                    aria-expanded={open}
                    aria-label="Menüyü aç/kapat"
                    className="border-line text-paper grid size-10 place-items-center rounded-xl border md:hidden"
                    onClick={() => {
                        setOpen(v => !v)
                    }}>
                    {open ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            <div
                className={cn(
                    'bg-ink/95 grid overflow-hidden border-t backdrop-blur-xl transition-[grid-template-rows,opacity,border-color] duration-300 md:hidden',
                    open
                        ? 'border-line grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] border-transparent opacity-0'
                )}
                id="mobile-menu"
                inert={!open}>
                <div className="min-h-0">
                    <nav className="container-x flex flex-col gap-1 py-4">
                        {mainNav.map(item => (
                            <Link
                                className={cn(
                                    'rounded-xl px-4 py-3 text-base transition-colors',
                                    isActive(item.href)
                                        ? 'bg-surface text-paper'
                                        : 'text-muted hover:bg-surface/60 hover:text-paper'
                                )}
                                href={item.href}
                                key={item.href}
                                onClick={closeMenu}>
                                {item.label}
                            </Link>
                        ))}
                        <ButtonLink
                            className="mt-2"
                            href="/iletisim"
                            onClick={closeMenu}>
                            Teklif Al
                        </ButtonLink>
                    </nav>
                </div>
            </div>
        </header>
    )
}
