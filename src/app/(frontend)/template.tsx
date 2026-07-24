import { PageTransition } from '@/components/motion/page-transition'

export default function FrontendTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return <PageTransition>{children}</PageTransition>
}
