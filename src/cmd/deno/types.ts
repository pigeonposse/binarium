export type Config = {
	/**
	 * Custom flags for `deno compile` cmd.
	 * For help, run: `deno compile --help`.
	 * @see https://docs.deno.com/go/compile
	 * @example [ '--allow-all', '--no-prompt' ]
	 */
	flags : string[] }
