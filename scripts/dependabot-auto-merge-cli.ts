// Entry point for .github/workflows/dependabot-auto-merge.yml: prints `safe` or
// `review` for the fetch-metadata outputs passed in the environment.
import { decideAutoMerge } from './dependabot-auto-merge'

const decision = decideAutoMerge({
    dependencyNames: process.env.DEPENDENCY_NAMES,
    ecosystem: process.env.PACKAGE_ECOSYSTEM,
    updateType: process.env.UPDATE_TYPE,
})
process.stdout.write(`${decision}\n`)
