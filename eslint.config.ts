import { next } from '@jubstaa/config/eslint/next'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores([
        'src/payload-types.ts',
        'src/migrations/**',
        'src/app/(payload)/**',
    ]),
    ...next({ tsconfigRootDir: import.meta.dirname }),
])
