interface ControlProps {
    'aria-describedby'?: string
    'aria-invalid'?: true
    'id': string
}

interface FormFieldProps {
    children: (control: ControlProps) => React.ReactNode
    error?: string | undefined
    id: string
    label: string
}

export function FormField({ children, error, id, label }: FormFieldProps) {
    const errorId = `${id}-error`

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-muted font-mono text-xs" htmlFor={id}>
                {label}
            </label>
            {children(
                error
                    ? { 'aria-describedby': errorId, 'aria-invalid': true, id }
                    : { id }
            )}
            {error ? (
                <p className="text-xs text-red-400" id={errorId}>
                    {error}
                </p>
            ) : null}
        </div>
    )
}
