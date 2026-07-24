import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { processSteps } from '@/views/home/home.constants'

export function HomeProcess() {
    return (
        <section className="container-x flex flex-col gap-12">
            <SectionHeading
                description="Fikirden yayına kadar şeffaf, ölçülebilir ve tekrarlanabilir bir süreç."
                eyebrow="nasıl çalışırız"
                title="Dört adımda ürününüz"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((step, index) => (
                    <Reveal
                        key={step.title}
                        className="card-surface relative flex flex-col gap-3 rounded-2xl p-6"
                        delay={index * 0.08}>
                        <span className="text-accent font-mono text-sm">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-paper text-lg font-semibold">
                            {step.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}
