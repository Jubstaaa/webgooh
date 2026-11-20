interface StatusMessageProps {
    children: React.ReactNode
    code: string
    description: string
    title: string
}

export function StatusMessage({
    children,
    code,
    description,
    title,
}: StatusMessageProps) {
    return (
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
            <div aria-hidden className="grid-backdrop absolute inset-0 -z-10" />
            <div className="container-x flex flex-col items-center gap-6 text-center">
                <span className="text-gradient font-mono text-6xl font-bold sm:text-8xl">
                    {code}
                </span>
                <h1 className="text-paper text-2xl font-semibold sm:text-3xl">
                    {title}
                </h1>
                <p className="text-muted max-w-md">{description}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {children}
                </div>
            </div>
        </section>
    )
}
