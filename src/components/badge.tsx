import { cn } from '@/lib/utils'

interface BadgeProps extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    'color'
> {
    color?: string | null
}

export function Badge({
    children,
    className,
    color,
    style,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'bg-ink/80 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.7rem] tracking-wider uppercase backdrop-blur-md',
                className
            )}
            style={{
                borderColor: color ? `${color}66` : undefined,
                color: color ?? undefined,
                ...style,
            }}
            {...props}>
            {color ? (
                <span
                    aria-hidden
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                />
            ) : null}
            <span className="text-paper/90">{children}</span>
        </span>
    )
}
