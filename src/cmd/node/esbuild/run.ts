import type { BuildOptions } from 'esbuild'

export type EsbuildConfig = BuildOptions

export const getEsbuild = () =>
	import( 'esbuild' )

/**
 * Asynchronously builds a project using the specified esbuild configuration options.
 *
 * @param   {EsbuildConfig} opts - The configuration options for esbuild,
 *                               including entry points, output settings, and plugins.
 * @returns {Promise<void>}      A promise that resolves when the build is complete.
 * @throws Will throw an error if the build process fails.
 */

export const esbuild = async ( opts: EsbuildConfig ) => {

	const { build } = await getEsbuild( )
	await build( opts )

}
