module.exports = {
    forbidden: [
        {
            name: 'no-circular',
            severity: 'error',
            from: {},
            to: { circular: true },
        },
        {
            name: 'no-orphans',
            severity: 'error',
            from: {
                orphan: true,
                pathNot: [
                    '\\.d\\.ts$',
                    '(^|/)tsconfig\\.json$',
                    '\\.test\\.tsx?$',
                    // Next.js route special files and metadata routes are entries, not orphans
                    '^src/app/.*/(page|layout|not-found|error|loading|route|template|default|opengraph-image|apple-icon|icon|manifest|robots|sitemap)\\.(tsx?|js)$',
                    '^src/app/(apple-icon|opengraph-image|manifest|robots|sitemap|layout|not-found)\\.tsx?$',
                    '^src/(instrumentation|proxy|payload\\.config)\\.ts$',
                    '^src/app/\\(payload\\)/',
                    '^src/migrations/',
                ],
            },
            to: {},
        },
        {
            name: 'not-to-dev-dep',
            severity: 'error',
            from: { path: '^src', pathNot: '\\.test\\.tsx?$' },
            to: {
                dependencyTypes: ['npm-dev'],
                dependencyTypesNot: ['type-only'],
                pathNot: ['node_modules/@types/'],
            },
        },
        {
            name: 'not-to-unresolvable',
            severity: 'error',
            from: {},
            to: { couldNotResolve: true },
        },
    ],
    options: {
        doNotFollow: { path: 'node_modules' },
        tsConfig: { fileName: 'tsconfig.json' },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            exportsFields: ['exports'],
            conditionNames: ['import', 'require', 'node', 'default', 'types'],
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
        },
        exclude: { path: ['node_modules', '\\.next'] },
    },
}
