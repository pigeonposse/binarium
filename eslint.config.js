import { dovenvEslintConfig } from '@dovenv/lint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	dovenvEslintConfig.includeGitIgnore(),
	...dovenvEslintConfig.config,
	{ rules: { '@stylistic/object-curly-newline': 'off' } },
	dovenvEslintConfig.setIgnoreConfig( [
		'README.md',
		'CHANGELOG.md',
		'docs/*.md',
		'**/dev-dist/**',
		'**/templates/**',
	] ),
]

