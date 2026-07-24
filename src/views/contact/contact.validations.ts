import { z } from 'zod'

export const contactSchema = z.object({
    company: z.string().optional(),
    email: z.string().email('Geçerli bir e-posta adresi girin.'),
    message: z.string().min(10, 'Lütfen talebinizi biraz detaylandırın.'),
    name: z.string().min(2, 'Adınızı girin.'),
    phone: z.string().optional(),
    service: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
