
// @ts-ignore
import ts             from '@babel/plugin-transform-typescript'
import babelPresetEnv from '@babel/preset-env'
// @ts-ignore
import importMeta from 'babel-plugin-transform-import-meta'
// @ts-ignore
import babel from 'esbuild-plugin-babel'

import type { Options } from '@babel/preset-env'

export const babelPlugin = ( target: string = 'current' ) => {

	const prestOpts: Options = {
		targets : { node: target },
		modules : 'commonjs', 
		
	}
	return babel( {
		config : {
			ignore  : [ '**/*.json' ],
			presets : [ [ babelPresetEnv, prestOpts ] ],
			plugins : [ importMeta(), ts ],
		},
	} )

}
