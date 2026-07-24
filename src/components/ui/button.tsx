import Link from 'next/link'

import { cva, type VariantProps } from 'class-variance-authority'

import type { ButtonLinkProps, ButtonProps } from '@/components/ui/button.types'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50',
    {
        defaultVariants: {
            size: 'md',
            variant: 'primary',
        },
        variants: {
            size: {
                lg: 'h-13 px-8 text-base',
                md: 'h-11 px-6 text-sm',
                sm: 'h-9 px-4 text-sm',
            },
            variant: {
                ghost: 'text-muted hover:text-paper hover:bg-surface/60',
                outline:
                    'border border-line bg-surface/40 text-paper hover:border-brand/60 hover:bg-surface',
                primary:
                    'bg-brand text-paper shadow-[0_8px_30px_-8px] shadow-brand/60 hover:bg-brand-bright hover:-translate-y-0.5',
            },
        },
    }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export function Button({ className, size, variant, ...props }: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ size, variant }), className)}
            {...props}
        />
    )
}

export function ButtonLink({
    className,
    size,
    variant,
    ...props
}: ButtonLinkProps) {
    return (
        <Link
            className={cn(buttonVariants({ size, variant }), className)}
            {...props}
        />
    )
}
