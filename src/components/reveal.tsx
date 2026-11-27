import { cn } from '@/lib/utils'

interface RevealProps {
    as?: 'article' | 'div' | 'li' | 'section'
    children: React.ReactNode
    className?: string
}

export function Reveal({ as: Tag = 'div', children, className }: RevealProps) {
    return <Tag className={cn('reveal', className)}>{children}</Tag>
}
