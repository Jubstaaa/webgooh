'use client'

import {
    type ErrorBoundaryProps,
    ErrorMessage,
} from '@/components/error-message'

export default function ErrorPage(props: ErrorBoundaryProps) {
    return <ErrorMessage {...props} />
}
