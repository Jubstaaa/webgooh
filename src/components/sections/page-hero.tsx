interface PageHeroProps {
    description?: string
    eyebrow: string
    title: string
}

export function PageHero({ description, eyebrow, title }: PageHeroProps) {
    return (
        <section className="border-line relative overflow-hidden border-b pt-16 pb-14">
            <div aria-hidden className="grid-backdrop absolute inset-0 -z-10" />
            <div
                aria-hidden
                className="glow absolute top-0 left-1/2 -z-10 h-64 w-[560px] -translate-x-1/2 opacity-40"
            />
            <div className="container-x flex flex-col gap-4">
                <span className="eyebrow">{`// ${eyebrow}`}</span>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {title}
                </h1>
                {description ? (
                    <p className="text-muted text-lg leading-relaxed">
                        {description}
                    </p>
                ) : null}
            </div>
        </section>
    )
}
