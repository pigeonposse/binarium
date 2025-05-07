/* eslint-disable @stylistic/object-curly-newline */

export type Config = {
	/**
	 * Custom flags for `bun build --compile` cmd.
	 * For help, run: `bun build --help`.
	 * @see https://bun.sh/docs/bundler
	 * @example [ '--minify' ]
	 */
	flags : string[]
}
