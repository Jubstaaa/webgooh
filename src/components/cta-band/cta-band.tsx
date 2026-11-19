import { ArrowRight } from 'lucide-react'

import { BorderBeam } from '@/components/border-beam'
import { ButtonLink } from '@/components/button'
import { Magnetic } from '@/components/magnetic'
import { Reveal } from '@/components/reveal'

import { ParticleField } from './particle-field'

interface CtaBandProps {
    description?: string
    title?: string
}

export function CtaBand({
    description = 'Fikrinizi anlatın, size en uygun teknoloji ve süreçle hayata geçirelim. İlk görüşme ücretsiz.',
    title = 'Bir sonraki projeniz burada başlasın',
}: CtaBandProps) {
    return (
        <section className="container-x">
            <Reveal className="card-surface relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16">
                <BorderBeam duration={4} />
                <ParticleField className="opacity-60" />
                <div
                    aria-hidden
                    className="glow absolute top-1/2 left-1/2 -z-0 h-72 w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-40"
                />
                <div className="relative flex flex-col items-center gap-6">
                    <span className="eyebrow">{'// hazır mısınız?'}</span>
                    <h2 className="text-paper max-w-2xl text-3xl font-semibold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="text-muted max-w-xl text-base leading-relaxed">
                        {description}
                    </p>
                    <Magnetic>
                        <ButtonLink href="/iletisim" size="lg">
                            Teklif alın
                            <ArrowRight className="size-4" />
                        </ButtonLink>
                    </Magnetic>
                </div>
            </Reveal>
        </section>
    )
}
