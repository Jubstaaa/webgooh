import type { BorderBeamProps } from '@/components/ui/border-beam.types'
import { cn } from '@/lib/utils'

export function BorderBeam({ className, duration = 7 }: BorderBeamProps) {
    return (
        <span
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit] motion-safe:animate-[spin-beam_var(--beam-duration)_linear_infinite]',
                className
            )}
            style={{
                ['--beam-duration' as string]: `${duration}s`,
                background:
                    'conic-gradient(from 0deg, transparent 0 60%, var(--color-accent) 74%, var(--color-brand-bright) 84%, var(--color-magenta) 94%, transparent 100%)',
                mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                maskComposite: 'exclude',
                padding: '1px',
                WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
            }}
        />
    )
}
