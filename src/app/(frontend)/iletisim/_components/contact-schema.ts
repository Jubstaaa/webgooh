import { z } from 'zod'

// Empty inputs arrive as '' from FormData; stored as absent rather than blank.
const optional = <T extends z.ZodType>(schema: T) =>
    z.preprocess(value => (value === '' ? undefined : value), schema.optional())

export function createContactSchema(services: readonly string[]) {
    return z.object({
        company: optional(z.string().trim().max(150)),
        email: z
            .email('Geçerli bir e-posta adresi girin.')
            .max(254, 'E-posta adresi çok uzun.'),
        message: z
            .string()
            .trim()
            .min(10, 'Lütfen talebinizi biraz detaylandırın.')
            .max(5000, 'Mesaj en fazla 5000 karakter olabilir.'),
        name: z
            .string()
            .trim()
            .min(2, 'Adınızı girin.')
            .max(100, 'Ad en fazla 100 karakter olabilir.'),
        phone: optional(
            z.string().trim().max(30, 'Telefon numarası çok uzun.')
        ),
        service: optional(
            z.string().refine(value => services.includes(value), {
                message: 'Listeden bir hizmet seçin.',
            })
        ),
    })
}
