const techStack: string[] = [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'React Native',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'Cloudflare',
    'Payload CMS',
    'Tailwind',
    'GraphQL',
    'CI/CD',
]

export function HomeMarquee() {
    return (
        <section className="border-line relative overflow-hidden border-y py-6">
            <div className="from-ink pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
            <div className="from-ink pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />
            <div className="animate-marquee flex w-max gap-4">
                {[...techStack, ...techStack].map((item, index) => (
                    <span
                        key={index}
                        className="border-line text-muted rounded-full border px-5 py-2 font-mono text-sm whitespace-nowrap">
                        {item}
                    </span>
                ))}
            </div>
        </section>
    )
}
