import { APIError, ValidationError } from 'payload'

export function errorSummary(error: unknown) {
    if (error instanceof ValidationError) {
        return {
            fields: error.data.errors.map(field => field.path),
            name: error.name,
            status: error.status,
        }
    }
    if (error instanceof APIError) {
        return { name: error.name, status: error.status }
    }
    if (error instanceof Error) {
        const code = driverCode(error) ?? driverCode(error.cause)

        return code ? { code, name: error.name } : { name: error.name }
    }

    return { name: typeof error }
}

function driverCode(error: unknown) {
    if (typeof error !== 'object' || error === null) return undefined
    const code: unknown = Reflect.get(error, 'code')

    return typeof code === 'string' ? code : undefined
}
