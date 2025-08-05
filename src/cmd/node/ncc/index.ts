export type NccConfig = {
	/**
	 * Provide a custom cache path or disable caching .
	 */
	cache?               : string | false
	/**
	 * Externals to leave as requires of the build.
	 */
	externals?           : string[]
	/**
	 * Directory outside of which never to emit assets.
	 */
	filterAssetBase?     : string
	minify?              : boolean
	sourceMap?           : boolean
	assetBuilds?         : boolean
	sourceMapBasePrefix? : string
	// when outputting a sourcemap, automatically include
	// source-map-support in the output file (increases output by 32kB).
	sourceMapRegister?   : boolean
	watch?               : boolean
	license?             : string
	target?              : string
	v8cache?             : boolean
}

/**
 * Compile a Node.js module into a single file using `@vercel/ncc`.
 *
 * @param   {object}          opts - The options to pass to `@vercel/ncc`.
 * @returns {Promise<string>}      The compiled code as a string.
 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
 */
export const ncc = async ( opts: NccConfig & { input: string } ) => {

	const {
		input, ...buildConfig
	} = opts

	// @ts-ignore
	const { default: run } = await import( '@vercel/ncc' )
	const { code }         = await run( input, buildConfig )
	return code as string

}
