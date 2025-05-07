
// @ts-ignore
import ts             from '@babel/plugin-transform-typescript'
import babelPresetEnv from '@babel/preset-env'
// @ts-ignore
import importMeta from 'babel-plugin-transform-import-meta'
// @ts-ignore
import babel from 'esbuild-plugin-babel'

import type { Options } from '@babel/preset-env'

/**
 * An esbuild plugin that uses Babel to compile modern JavaScript to
 * versions supported by the given target Node.js version.
 * @param {string} [target] The target Node.js version.
 * The default is to use the current Node.js version.
 * @returns {Plugin} The esbuild plugin
 */
export const babelEsbuildPlugin = ( target: string = 'current' ) => {

	const prestOpts: Options = {
		targets : { node: target },
		modules : 'commonjs',

	}
	return babel( { config : {
		ignore  : [ '**/*.json' ],
		presets : [ [ babelPresetEnv, prestOpts ] ],
		plugins : [ importMeta(), ts ],
	} } )

}
