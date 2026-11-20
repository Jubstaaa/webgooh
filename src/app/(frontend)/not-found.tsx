import { ButtonLink } from '@/components/button'
import { StatusMessage } from '@/components/status-message'

export default function NotFound() {
    return (
        <StatusMessage
            code="404"
            description="Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir."
            title="Sayfa bulunamadı">
            <ButtonLink href="/">Ana sayfaya dön</ButtonLink>
        </StatusMessage>
    )
}
