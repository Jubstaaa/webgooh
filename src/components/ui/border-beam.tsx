import type { BorderBeamProps } from '@/components/ui/border-beam.types'
import { cn } from '@/lib/utils'

export function BorderBeam({
    className,
    delay = 0,
    duration = 3,
    size = 240,
}: BorderBeamProps) {
    return (
        <span
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit] border-[3px] border-transparent',
                className
            )}
            style={{
                maskClip: 'padding-box, border-box',
                maskComposite: 'intersect',
                maskImage:
                    'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
                WebkitMaskClip: 'padding-box, border-box',
                WebkitMaskComposite: 'source-in',
                WebkitMaskImage:
                    'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
            }}>
            <span
                className="absolute aspect-square motion-safe:animate-[border-beam_var(--beam-duration)_linear_infinite]"
                style={{
                    ['--beam-duration' as string]: `${duration}s`,
                    animationDelay: `${delay}s`,
                    background:
                        'linear-gradient(to left, var(--color-accent), var(--color-brand-bright) 55%, transparent 92%)',
                    filter: 'drop-shadow(0 0 6px var(--color-accent))',
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
                    width: `${size}px`,
                }}
            />
        </span>
    )
}
