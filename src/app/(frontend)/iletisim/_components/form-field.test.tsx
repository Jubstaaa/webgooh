import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, test } from 'bun:test'

import { FormField } from './form-field'

function render(error?: string) {
    return renderToStaticMarkup(
        <FormField error={error} id="email" label="E-posta *">
            {control => <input {...control} type="email" />}
        </FormField>
    )
}

describe('FormField', () => {
    test('labels the control', () => {
        expect(render()).toContain(
            '<label class="text-muted font-mono text-xs" for="email">E-posta *</label>'
        )
        expect(render()).toContain('id="email"')
    })

    test('a valid control is not marked invalid', () => {
        const html = render()

        expect(html).not.toContain('aria-invalid')
        expect(html).not.toContain('aria-describedby')
    })

    test('an error marks the control invalid and describes it', () => {
        const html = render('Geçerli bir e-posta adresi girin.')

        expect(html).toContain('aria-invalid="true"')
        expect(html).toContain('aria-describedby="email-error"')
        expect(html).toContain(
            '<p class="text-xs text-red-400" id="email-error">Geçerli bir e-posta adresi girin.</p>'
        )
    })
})
