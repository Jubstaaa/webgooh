import { APIError, ValidationError } from 'payload'

// Container logs are read outside this app, so a failed write is logged by
// kind only. Payload validation errors carry the submitted data, and the
// SQLite adapter's query errors quote the bound values (an editor's or a
// visitor's email, phone, message) in their message, params and cause.
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

// libsql and node:sqlite put a stable code (SQLITE_BUSY, …) on the error, or
// on its cause once Drizzle has wrapped it.
function driverCode(error: unknown) {
    if (typeof error !== 'object' || error === null) return undefined
    const code: unknown = Reflect.get(error, 'code')

    return typeof code === 'string' ? code : undefined
}
