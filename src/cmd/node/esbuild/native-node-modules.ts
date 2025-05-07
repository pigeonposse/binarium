import type { Plugin } from 'esbuild'

/**
 * Esbuild plugin used to import native node modules.
 *
 * This plugin intercepts imports of ".node" files, resolves them to absolute paths,
 * and loads them using the "require()" function at runtime. It also loads the
 * ".node" files in the output directory using the "file" loader.
 *
 * This is required because esbuild's default loading behavior does not support
 * loading native node modules.
 *
 * This plugin is used by the esbuild builder.
 * @returns {Plugin} The esbuild plugin
 */
export const nativeNodeModulesEsbuildPlugin = () => ( {
	name : 'binarium-native-node-modules',
	setup( build ) {

		// If a ".node" file is imported within a module in the "file" namespace, resolve
		// it to an absolute path and put it into the "node-file" virtual namespace.
		build.onResolve( {
			filter    : /\.node$/,
			namespace : 'file',
		}, args => ( {
			path      : require.resolve( args.path, { paths: [ args.resolveDir ] } ),
			namespace : 'node-file',
		} ) )

		// Files in the "node-file" virtual namespace call "require()" on the
		// path from esbuild of the ".node" file in the output directory.
		build.onLoad( {
			filter    : /.*/,
			namespace : 'node-file',
		}, args => ( { contents : `
		  import path from ${JSON.stringify( args.path )}
		  try { module.exports = require(path) }
		  catch {}
		` } ) )

		// If a ".node" file is imported within a module in the "node-file" namespace, put
		// it in the "file" namespace where esbuild's default loading behavior will handle
		// it. It is already an absolute path since we resolved it to one above.
		build.onResolve( {
			filter    : /\.node$/,
			namespace : 'node-file',
		}, args => ( {
			path      : args.path,
			namespace : 'file',
		} ) )

		// Tell esbuild's default loading behavior to use the "file" loader for
		// these ".node" files.
		const opts           = build.initialOptions
		opts.loader          = opts.loader || {}
		opts.loader['.node'] = 'file'

	},
} satisfies Plugin )
