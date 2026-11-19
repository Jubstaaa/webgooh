import { cn } from '@/lib/utils'

interface RevealProps {
    as?: 'div' | 'li' | 'section' | 'article'
    children: React.ReactNode
    className?: string
}

// Scroll-driven CSS (see .reveal in globals.css): no hydration, and content
// that starts on screen is never hidden.
export function Reveal({ as: Tag = 'div', children, className }: RevealProps) {
    return <Tag className={cn('reveal', className)}>{children}</Tag>
}
