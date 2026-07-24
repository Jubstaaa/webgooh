import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/sections/cta-band'
import { PageHero } from '@/components/sections/page-hero'
import { SectionHeading } from '@/components/ui/section-heading'
import { values } from '@/views/about/about.constants'

export function About() {
    return (
        <div className="flex flex-col gap-24 pb-8">
            <PageHero
                description="Webgooh, yılların ajans tecrübesini yazılım mühendisliği ve siber güvenlik uzmanlığıyla birleştiren yeni nesil bir dijital ürün stüdyosudur."
                eyebrow="hakkımızda"
                title="Web’in Van Gogh’u"
            />

            <section className="container-x">
                <Reveal className="flex flex-col gap-5">
                    <span className="eyebrow">{'// hikayemiz'}</span>
                    <h2 className="text-3xl font-semibold sm:text-4xl">
                        Köklü tecrübe, yeni nesil mühendislik
                    </h2>
                    <div className="text-muted flex flex-col gap-4 text-base leading-relaxed">
                        <p>
                            Webgooh yıllardır markalara web yazılım, mobil
                            uygulama ve tasarım hizmetleri sunan köklü bir ajans
                            olarak İstanbul’da projeler geliştirdi.
                        </p>
                        <p>
                            Bugün ise yazılım geliştirme ve siber güvenlik
                            alanında uzman yeni ekibiyle birlikte, bu tecrübeyi
                            modern teknoloji, güvenlik ve DevOps kültürüyle
                            harmanlıyor; markaların dijitalde güvenle büyümesini
                            sağlıyoruz.
                        </p>
                    </div>
                </Reveal>
            </section>

            <section className="container-x flex flex-col gap-12">
                <SectionHeading
                    description="Çalışma şeklimizi ve kararlarımızı belirleyen ilkeler."
                    eyebrow="değerlerimiz"
                    title="Bizi biz yapan ilkeler"
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <Reveal
                            key={value.title}
                            className="card-surface flex flex-col gap-3 rounded-2xl p-6"
                            delay={index * 0.06}>
                            <div className="bg-brand/12 text-brand-bright ring-brand/25 grid size-11 place-items-center rounded-xl ring-1">
                                <value.icon
                                    className="size-5"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h3 className="text-paper text-lg font-semibold">
                                {value.title}
                            </h3>
                            <p className="text-muted text-sm leading-relaxed">
                                {value.description}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
