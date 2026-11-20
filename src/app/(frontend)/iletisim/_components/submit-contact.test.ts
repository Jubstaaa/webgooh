import {
    afterAll,
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from 'bun:test'

const create = mock((_args: { collection: string; data: unknown }) =>
    Promise.resolve({ id: 1 })
)

void mock.module('next/headers', () => ({
    headers: () =>
        Promise.resolve(new Headers({ 'cf-connecting-ip': '1.2.3.4' })),
}))
const findServices = mock(() =>
    Promise.resolve({ docs: [{ title: 'Web Geliştirme' }] })
)

// getServices goes through the real query module, so its cache wrapper is a
// pass-through and Payload answers the services lookup too.
void mock.module('next/cache', () => ({
    revalidatePath: () => {},
    revalidateTag: () => {},
    unstable_cache: <T>(fn: T) => fn,
}))
void mock.module('@/lib/payload', () => ({
    getPayloadClient: () =>
        Promise.resolve({
            create,
            find: findServices,
        }),
}))

const { submitContact } = await import('./submit-contact')

const realFetch = globalThis.fetch
const siteverify = mock((_url: string, _init: RequestInit) =>
    Promise.resolve(Response.json({ success: true }))
)
const consoleError = spyOn(console, 'error').mockImplementation(() => {})

const valid = {
    'cf-turnstile-response': 'token',
    'email': 'ayse@example.com',
    'message': 'Kurumsal sitemizi yenilemek istiyoruz.',
    'name': 'Ayşe Yılmaz',
    'service': 'Web Geliştirme',
}

function submit(fields: Record<string, string>, attempt?: number) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(fields)) {
        formData.set(key, value)
    }

    return submitContact(
        { status: 'idle', ...(attempt ? { attempt } : {}) },
        formData
    )
}

beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = 'secret'
    globalThis.fetch = siteverify as unknown as typeof fetch
})

afterEach(() => {
    create.mockClear()
    findServices.mockClear()
    siteverify.mockClear()
    consoleError.mockClear()
})

afterAll(() => {
    globalThis.fetch = realFetch
    delete process.env.TURNSTILE_SECRET_KEY
})

describe('submitContact', () => {
    test('saves a valid lead and reports success', async () => {
        const state = await submit(valid)

        expect(state).toEqual({
            message: 'Talebiniz alındı. En kısa sürede size dönüş yapacağız.',
            status: 'success',
        })
        expect(create).toHaveBeenCalledWith({
            collection: 'leads',
            data: {
                email: 'ayse@example.com',
                message: 'Kurumsal sitemizi yenilemek istiyoruz.',
                name: 'Ayşe Yılmaz',
                service: 'Web Geliştirme',
            },
        })
    })

    test('passes the visitor IP and token to Turnstile', async () => {
        await submit(valid)

        const body = siteverify.mock.calls[0]?.[1].body as URLSearchParams
        expect(body.toString()).toBe(
            'response=token&secret=secret&remoteip=1.2.3.4'
        )
    })

    test('answers a filled honeypot with a silent success and saves nothing', async () => {
        const state = await submit({ ...valid, company_website: 'spam.biz' })

        expect(state).toEqual({
            message: 'Talebiniz alındı.',
            status: 'success',
        })
        expect(siteverify).not.toHaveBeenCalled()
        expect(create).not.toHaveBeenCalled()
    })

    test('rejects a failed Turnstile check and keeps what was typed', async () => {
        siteverify.mockImplementationOnce(() =>
            Promise.resolve(Response.json({ success: false }))
        )

        const state = await submit(valid, 2)

        expect(state.status).toBe('error')
        expect(state.attempt).toBe(3)
        expect(state.message).toBe(
            'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'
        )
        expect(state.values?.email).toBe('ayse@example.com')
        expect(create).not.toHaveBeenCalled()
    })

    test('returns field errors for invalid input', async () => {
        const state = await submit({
            ...valid,
            email: 'not-an-email',
            service: 'Uydurma',
        })

        expect(state.status).toBe('error')
        expect(state.attempt).toBe(1)
        expect(state.errors).toEqual({
            email: 'Geçerli bir e-posta adresi girin.',
            service: 'Listeden bir hizmet seçin.',
        })
        expect(state.values?.email).toBe('not-an-email')
        expect(create).not.toHaveBeenCalled()
    })

    test('keeps the values and logs when saving the lead fails', async () => {
        // The shape the SQLite adapter throws: the query text and its bound
        // values (the visitor's details) in message and params, the driver's
        // code on the cause.
        const failure = Object.assign(
            new Error(
                'Failed query: insert into "leads" params: ayse@example.com,0555 123 45 67'
            ),
            {
                cause: Object.assign(new Error('database is locked'), {
                    code: 'SQLITE_BUSY',
                }),
                name: 'DrizzleQueryError',
                params: ['ayse@example.com', '0555 123 45 67'],
            }
        )
        create.mockImplementationOnce(() => Promise.reject(failure))

        const state = await submit(valid)

        expect(state).toEqual({
            attempt: 1,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            status: 'error',
            values: {
                company: '',
                email: 'ayse@example.com',
                message: 'Kurumsal sitemizi yenilemek istiyoruz.',
                name: 'Ayşe Yılmaz',
                phone: '',
                service: 'Web Geliştirme',
            },
        })
        expect(consoleError).toHaveBeenCalledWith(
            'Saving a contact lead failed',
            { code: 'SQLITE_BUSY', name: 'DrizzleQueryError' }
        )
        const logged = JSON.stringify(consoleError.mock.calls)
        expect(logged).not.toContain('ayse@example.com')
        expect(logged).not.toContain('0555 123 45 67')
    })

    test('keeps the values when the service list cannot be read', async () => {
        const failure = Object.assign(new Error('unable to open database'), {
            code: 'SQLITE_CANTOPEN',
        })
        findServices.mockImplementationOnce(() => Promise.reject(failure))

        const state = await submit(valid)

        expect(state.status).toBe('error')
        expect(state.message).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
        expect(state.values?.email).toBe('ayse@example.com')
        expect(create).not.toHaveBeenCalled()
        expect(consoleError).toHaveBeenCalledWith(
            'Saving a contact lead failed',
            { code: 'SQLITE_CANTOPEN', name: 'Error' }
        )
    })
})
