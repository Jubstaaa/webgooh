import { ArrowRight, ShieldCheck } from 'lucide-react'

import { BorderBeam } from '@/components/border-beam'
import { ButtonLink } from '@/components/button'
import { Magnetic } from '@/components/magnetic'
import { getContentCounts } from '@/lib/queries'
import { SITE_URL } from '@/lib/site.mjs'

import { NeuralMesh } from './neural-mesh'

interface TerminalLine {
    prompt?: string
    text: string
    tone?: 'ok' | 'accent'
}

export async function HomeHero() {
    const counts = await getContentCounts()

    const pages =
        6 + counts.posts + counts.services + counts.projects + counts.categories
    const domain = new URL(SITE_URL).host

    const terminalLines: TerminalLine[] = [
        { prompt: '~/webgooh', text: 'deploy --prod' },
        { text: '✓ build           next@16 · turbopack', tone: 'ok' },
        { text: '✓ audit           0 kritik açık', tone: 'ok' },
        { text: '✓ lighthouse      performans 100 / seo 100', tone: 'ok' },
        { text: `✓ ssg             ${pages} sayfa · edge cache`, tone: 'ok' },
        { text: `→ canlı: https://${domain}`, tone: 'accent' },
    ]

    return (
        <section className="relative overflow-hidden pt-20 pb-0 sm:pt-28 sm:pb-24">
            <NeuralMesh className="-z-20 opacity-70" />
            <div aria-hidden className="grid-backdrop absolute inset-0 -z-10" />
            <div
                aria-hidden
                className="glow absolute top-0 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 opacity-60"
            />

            <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="hero-rise flex flex-col gap-7">
                    <div>
                        <span className="border-line bg-surface/50 text-muted inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs">
                            <ShieldCheck className="text-accent size-3.5" />
                            yazılım · mobil · siber güvenlik
                        </span>
                    </div>

                    <div>
                        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            Markanızı büyüten
                            <br />
                            <span className="text-gradient">
                                dijital mühendislik
                            </span>
                        </h1>
                    </div>

                    <div>
                        <p className="text-muted max-w-xl text-lg leading-relaxed">
                            Web ve mobil uygulamalardan kurumsal yazılıma, UX/UI
                            tasarımdan siber güvenlik ve DevOps’a kadar;
                            fikrinizi ölçeklenebilir, hızlı ve güvenli ürünlere
                            dönüştürüyoruz.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Magnetic>
                            <ButtonLink href="/iletisim" size="lg">
                                Projenizi konuşalım
                                <ArrowRight className="size-4" />
                            </ButtonLink>
                        </Magnetic>
                        <Magnetic>
                            <ButtonLink
                                href="/hizmetlerimiz"
                                size="lg"
                                variant="outline">
                                Hizmetleri keşfet
                            </ButtonLink>
                        </Magnetic>
                    </div>
                </div>

                <div className="hero-rise relative">
                    <div>
                        <div className="card-surface shadow-brand/10 relative overflow-hidden rounded-2xl shadow-2xl">
                            <BorderBeam />
                            <div className="border-line bg-ink-soft/80 flex items-center gap-2 border-b px-4 py-3">
                                <span className="size-3 rounded-full bg-red-400/70" />
                                <span className="size-3 rounded-full bg-yellow-400/70" />
                                <span className="size-3 rounded-full bg-green-400/70" />
                                <span className="text-faint ml-2 font-mono text-xs">
                                    webgooh — pipeline
                                </span>
                            </div>
                            <div className="relative flex flex-col gap-2 p-5 font-mono text-sm">
                                {terminalLines.map((line, index) => (
                                    <div key={index} className="flex gap-2">
                                        {line.prompt ? (
                                            <span className="text-brand-bright">
                                                {line.prompt} $
                                            </span>
                                        ) : null}
                                        <span
                                            className={
                                                line.tone === 'ok'
                                                    ? 'text-emerald-400/90'
                                                    : line.tone === 'accent'
                                                      ? 'text-accent'
                                                      : 'text-paper'
                                            }>
                                            {line.text}
                                        </span>
                                    </div>
                                ))}
                                <span className="bg-accent mt-1 inline-block h-4 w-2 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
