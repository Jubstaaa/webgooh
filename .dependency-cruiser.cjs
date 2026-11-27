module.exports = {
    forbidden: [
        {
            from: {},
            name: 'no-circular',
            severity: 'error',
            to: { circular: true },
        },
        {
            from: {
                orphan: true,
                pathNot: [
                    '\\.d\\.ts$',
                    '(^|/)tsconfig\\.json$',
                    '\\.test\\.tsx?$',

                    '^src/app/.*/(page|layout|not-found|error|loading|route|template|default|opengraph-image|apple-icon|icon|manifest|robots|sitemap)\\.(tsx?|js)$',
                    '^src/app/(apple-icon|opengraph-image|manifest|robots|sitemap|layout|not-found)\\.tsx?$',
                    '^src/(instrumentation|proxy|payload\\.config)\\.ts$',
                    '^src/app/\\(payload\\)/',
                    '^src/migrations/',
                ],
            },
            name: 'no-orphans',
            severity: 'error',
            to: {},
        },
        {
            from: { path: '^src', pathNot: '\\.test\\.tsx?$' },
            name: 'not-to-dev-dep',
            severity: 'error',
            to: {
                dependencyTypes: ['npm-dev'],
                dependencyTypesNot: ['type-only'],
                pathNot: ['node_modules/@types/'],
            },
        },
        {
            from: {},
            name: 'not-to-unresolvable',
            severity: 'error',
            to: { couldNotResolve: true },
        },
    ],
    options: {
        doNotFollow: { path: 'node_modules' },
        enhancedResolveOptions: {
            conditionNames: ['import', 'require', 'node', 'default', 'types'],
            exportsFields: ['exports'],
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
        },
        exclude: { path: ['node_modules', '\\.next'] },
        tsConfig: { fileName: 'tsconfig.json' },
        tsPreCompilationDeps: true,
    },
}
