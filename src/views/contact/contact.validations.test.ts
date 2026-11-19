import { describe, expect, test } from 'bun:test'

import { createContactSchema } from '@/views/contact/contact.validations'

const schema = createContactSchema(['Web Yazılım', 'Mobil Uygulama'])

const valid = {
    email: 'ayse@example.com',
    message: 'Bir web sitesi yaptırmak istiyoruz.',
    name: 'Ayşe Yılmaz',
}

describe('contact schema', () => {
    test('accepts a minimal valid lead', () => {
        expect(schema.safeParse(valid).success).toBe(true)
    })

    test('accepts a service that the site offers', () => {
        const result = schema.safeParse({ ...valid, service: 'Web Yazılım' })

        expect(result.success && result.data.service).toBe('Web Yazılım')
    })

    test('rejects a service the site does not offer', () => {
        expect(
            schema.safeParse({ ...valid, service: 'anything else' }).success
        ).toBe(false)
    })

    test('treats empty optional fields as absent', () => {
        const result = schema.safeParse({
            ...valid,
            company: '',
            phone: '',
            service: '',
        })

        expect(result.success).toBe(true)
        expect(result.data).toEqual(valid)
    })

    test.each<[string, number]>([
        ['name', 101],
        ['email', 255],
        ['phone', 31],
        ['company', 151],
        ['message', 5001],
    ])('rejects a %s longer than the cap', (field, length) => {
        const value =
            field === 'email'
                ? `${'a'.repeat(length - '@example.com'.length)}@example.com`
                : 'a'.repeat(length)

        expect(schema.safeParse({ ...valid, [field]: value }).success).toBe(
            false
        )
    })
})
