/* eslint-disable camelcase */
import { wasmLoader } from 'esbuild-plugin-wasm'

import {
	isAbsolutePath,
	joinPath,
	readFile,
} from '../../../_shared/sys'

import type { Plugin } from 'esbuild'

/**
 * Esbuild plugin that compiles WebAssembly binaries.
 *
 * Loads `.wasm` files as a js module.
 * @returns {Plugin} The esbuild plugin
 */
export const wasmEsbuildPlugin = wasmLoader

/**
 * EXPERIMENTAL.
 * @description Esbuild plugin that compiles WebAssembly binaries.
 *
 * This plugin is currently experimental because it is not clear whether
 * it is better to use this plugin or the "wasm" loader in "esbuild-plugin-wasm".
 *
 * This plugin works by resolving ".wasm" files to a path with the
 * "wasm-stub" namespace. It then loads that path with the JavaScript
 * code for compiling the binary. The binary itself is imported from
 * a second virtual module in the "wasm-binary" namespace.
 *
 * This plugin currently only supports compiling WebAssembly binaries
 * with the "WebAssembly.instantiate" API. It does not support compiling
 * WebAssembly binaries with the "WebAssembly.compile" API. It also does
 * not support loading WebAssembly binaries as ES modules.
 * @returns {Plugin} The esbuild plugin
 */
export const _experimental__wasmEsbuildPlugin =  () => ( {
	name : 'binarium-experimental-wasm',
	setup( build ) {

		// Resolve ".wasm" files to a path with a namespace
		build.onResolve( { filter: /\.wasm$/ }, args => {

			// If this is the import inside the stub module, import the
			// binary itself. Put the path in the "wasm-binary" namespace
			// to tell our binary load callback to load the binary file.
			if ( args.namespace === 'wasm-stub' ) {

				return {
					path      : args.path,
					namespace : 'wasm-binary',
				}

			}

			// Otherwise, generate the JavaScript stub module for this
			// ".wasm" file. Put it in the "wasm-stub" namespace to tell
			// our stub load callback to fill it with JavaScript.
			//
			// Resolve relative paths to absolute paths here since this
			// resolve callback is given "resolveDir", the directory to
			// resolve imports against.
			if ( args.resolveDir === '' ) {

				return // Ignore unresolvable paths

			}
			return {
				path      : isAbsolutePath( args.path ) ? args.path : joinPath( args.resolveDir, args.path ),
				namespace : 'wasm-stub',
			}

		} )

		// Virtual modules in the "wasm-stub" namespace are filled with
		// the JavaScript code for compiling the WebAssembly binary. The
		// binary itself is imported from a second virtual module.
		build.onLoad( {
			filter    : /.*/,
			namespace : 'wasm-stub',
		}, async args => ( { contents : `import wasm from ${JSON.stringify( args.path )}
		  export default (imports) =>
			WebAssembly.instantiate(wasm, imports).then(
			  result => result.instance.exports)` } ) )

		// Virtual modules in the "wasm-binary" namespace contain the
		// actual bytes of the WebAssembly file. This uses esbuild's
		// built-in "binary" loader instead of manually embedding the
		// binary data inside JavaScript code ourselves.
		build.onLoad( {
			filter    : /.*/,
			namespace : 'wasm-binary',
		}, async args => ( {
			contents : await readFile( args.path ),
			loader   : 'binary',
		} ) )

	},
} satisfies Plugin )
