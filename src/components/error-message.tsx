'use client'

import { useEffect } from 'react'

import { Button, ButtonLink } from '@/components/button'
import { StatusMessage } from '@/components/status-message'

export interface ErrorBoundaryProps {
    error: unknown
    retry: () => void
}

export function ErrorMessage({ error, retry }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <StatusMessage
            code="500"
            description="Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."
            title="Bir şeyler ters gitti">
            <Button type="button" onClick={retry}>
                Tekrar dene
            </Button>
            <ButtonLink href="/" variant="outline">
                Ana sayfaya dön
            </ButtonLink>
        </StatusMessage>
    )
}
