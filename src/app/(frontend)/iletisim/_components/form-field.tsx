interface ControlProps {
    'id': string
    'aria-describedby'?: string
    'aria-invalid'?: true
}

interface FormFieldProps {
    id: string
    children: (control: ControlProps) => React.ReactNode
    error?: string | undefined
    label: string
}

// The control gets its id and, when invalid, aria-invalid plus a pointer to the
// message, so a screen reader reads the error when the field takes focus.
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
