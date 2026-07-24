import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
    return (
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
            <div aria-hidden className="grid-backdrop absolute inset-0 -z-10" />
            <div className="container-x flex flex-col items-center gap-6 text-center">
                <span className="text-gradient font-mono text-6xl font-bold sm:text-8xl">
                    404
                </span>
                <h1 className="text-paper text-2xl font-semibold sm:text-3xl">
                    Sayfa bulunamadı
                </h1>
                <p className="text-muted max-w-md">
                    Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.
                </p>
                <ButtonLink href="/">Ana sayfaya dön</ButtonLink>
            </div>
        </section>
    )
}
