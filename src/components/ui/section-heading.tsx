import { cn } from '@/lib/utils'

interface SectionHeadingProps {
    align?: 'left' | 'center'
    description?: string
    eyebrow: string
    title: string
}

export function SectionHeading({
    align = 'left',
    description,
    eyebrow,
    title,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'flex max-w-2xl flex-col gap-4',
                align === 'center' && 'mx-auto items-center text-center'
            )}>
            <span className="eyebrow">{`// ${eyebrow}`}</span>
            <h2 className="text-paper text-3xl font-semibold sm:text-4xl">
                {title}
            </h2>
            {description ? (
                <p className="text-muted text-base leading-relaxed">
                    {description}
                </p>
            ) : null}
        </div>
    )
}
