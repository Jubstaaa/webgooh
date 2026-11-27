'use client'

import { Button, ButtonLink } from '@/components/button'
import { StatusMessage } from '@/components/status-message'

export interface ErrorBoundaryProps {
    error: unknown
    retry: () => void
}

export function ErrorMessage({ retry }: ErrorBoundaryProps) {
    return (
        <StatusMessage
            code="500"
            description="Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."
            title="Bir şeyler ters gitti">
            <Button onClick={retry} type="button">
                Tekrar dene
            </Button>
            <ButtonLink href="/" variant="outline">
                Ana sayfaya dön
            </ButtonLink>
        </StatusMessage>
    )
}
