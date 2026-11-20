import nextConfig from 'eslint-config-next'
import perfectionistPlugin from 'eslint-plugin-perfectionist'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

const eslintConfig = [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'src/payload-types.ts',
            'src/migrations/**',
            'src/app/(payload)/**',
            'next-env.d.ts',
        ],
    },
    ...nextConfig,
    // Type-aware rules: the parser already builds a program for every file
    // (projectService below), so these cost little more and catch what syntax
    // rules cannot (unhandled promises, needless casts, unsafe any).
    ...tseslint.configs.recommendedTypeChecked.map(config => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
    })),
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'perfectionist': perfectionistPlugin,
            'prettier': prettierPlugin,
            'react': reactPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            // The core rule cannot read TypeScript: it flags parameter names
            // inside function types.
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            'no-console': ['warn', { allow: ['error'] }],
            'no-unused-vars': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            // eslint-plugin-import's order rule crashes under ESLint 10 whenever
            // it has something to report, so ordering comes from perfectionist.
            'perfectionist/sort-imports': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: ['^react$', '^react-.+'],
                            groupName: 'react',
                        },
                        {
                            elementNamePattern: ['^next$', '^next/.+'],
                            groupName: 'next',
                        },
                    ],
                    groups: [
                        'builtin',
                        'react',
                        'next',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                        'unknown',
                    ],
                    ignoreCase: true,
                    internalPattern: [
                        '^@/.+',
                        '^@payload-config$',
                        '^@payload-types$',
                    ],
                    newlinesBetween: 1,
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'perfectionist/sort-interfaces': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^(id|uuid)$',
                            groupName: 'identity',
                        },
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['identity', 'unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'perfectionist/sort-named-imports': [
                'warn',
                { order: 'asc', type: 'alphabetical' },
            ],
            'perfectionist/sort-object-types': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^(id|uuid)$',
                            groupName: 'identity',
                        },
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['identity', 'unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'perfectionist/sort-objects': [
                'warn',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'react/jsx-sort-props': [
                'warn',
                {
                    callbacksLast: true,
                    ignoreCase: true,
                    locale: 'auto',
                    multiline: 'last',
                    reservedFirst: ['key', 'ref'],
                    shorthandFirst: true,
                    shorthandLast: false,
                },
            ],
        },
    },
    prettierConfig,
]

export default eslintConfig
