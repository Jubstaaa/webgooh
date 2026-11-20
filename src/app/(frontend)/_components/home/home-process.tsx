import { SectionHeading } from '@/components/section-heading'

interface ProcessStep {
    description: string
    title: string
}

const processSteps: ProcessStep[] = [
    {
        description:
            'İhtiyaçlarınızı, hedef kitlenizi ve iş hedeflerinizi analiz eder, yol haritasını çıkarırız.',
        title: 'Keşif & Strateji',
    },
    {
        description:
            'Kullanıcı deneyimini merkeze alan arayüzleri tasarlar, tıklanabilir prototiplerle doğrularız.',
        title: 'Tasarım & Prototip',
    },
    {
        description:
            'Modern teknolojilerle geliştirir, her katmanda güvenlik testleriyle üretime hazırlarız.',
        title: 'Geliştirme & Güvenlik',
    },
    {
        description:
            'CI/CD hatlarıyla yayına alır, performans ve SEO’yu sürekli izleyip büyütürüz.',
        title: 'Yayın & Büyüme',
    },
]

export function HomeProcess() {
    return (
        <section className="container-x flex flex-col gap-12">
            <SectionHeading
                description="Fikirden yayına kadar şeffaf, ölçülebilir ve tekrarlanabilir bir süreç."
                eyebrow="nasıl çalışırız"
                title="Dört adımda ürününüz"
            />

            <div className="process-timeline relative flex flex-col gap-10 pl-10">
                <div className="bg-line absolute top-1.5 bottom-1.5 left-[11px] w-0.5 overflow-hidden rounded-full">
                    <div className="process-fill from-accent via-brand to-magenta h-full w-full origin-top bg-gradient-to-b" />
                </div>

                {processSteps.map((step, index) => (
                    <TimelineStep key={step.title} index={index} step={step} />
                ))}
            </div>
        </section>
    )
}

function TimelineStep({ index, step }: { index: number; step: ProcessStep }) {
    return (
        <div className="process-step reveal relative">
            <span className="process-dot bg-ink border-line text-faint absolute top-0.5 -left-10 grid size-6 place-items-center rounded-full border-2 font-mono text-[0.7rem]">
                {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-paper text-lg font-semibold">{step.title}</h3>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
                {step.description}
            </p>
        </div>
    )
}
