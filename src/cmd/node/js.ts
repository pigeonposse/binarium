/**
 * ESBUILD BUILD.
 * @see https://esbuild.github.io/api/#build
 */
import { babelPlugin }       from './esbuild/babel'
import { copy }              from './esbuild/copy'
import { httpPlugin }        from './esbuild/http'
import { nativeNodeModules } from './esbuild/native-node-modules'
import { wasmLoader }        from './esbuild/wasm'
import { catchError }        from '../../_shared/error'
import {
	existsPath,
	joinPath,
	packageDir,
	resolvePath,
} from '../../_shared/sys'
import { mergeCustom } from '../../_shared/vars'

import type { Config }       from './types'
import type { ConfigParams } from '../../types'

type Opts = {
	input         : string
	output        : string
	target        : string
	targetVersion : string
	assets?       : ConfigParams['assets']
	config?       : Config['esbuild']
	isDebug?      : boolean
	debug         : ( data: object | string ) => void
}

export default async ( data: Opts ) => {

	const getTsConfig = async () => {

		const userTs      = resolvePath( 'tsconfig.json' )
		const existUserTs = await existsPath( userTs )
		if ( existUserTs ) return userTs
		return joinPath( packageDir, 'tsconfig.builder.json' )

	}

	type BuildConfig = NonNullable<Config['esbuild']>
	const merge = mergeCustom<BuildConfig>( {} )

	const defConfig: BuildConfig = {
		entryPoints : [ data.input ],
		minify      : true,
		bundle      : true,
		format      : 'cjs',
		platform    : 'node',
		target      : data.target,
		outfile     : data.output,
		tsconfig    : await getTsConfig(),
		logOverride : { 'direct-eval': 'silent' },
		loader      : { '.node': 'file' },
		plugins     : [
			httpPlugin,
			nativeNodeModules,
			copy( { assets: data.assets } ),
			wasmLoader( { mode: 'embedded' } ),
			babelPlugin( data.targetVersion ),
		],
	}

	const buildConfig = data.config
		? merge(
			defConfig,
			data.config,
		)
		: defConfig

	const run = async () => {

		data.debug( { esbuild : {
			config : buildConfig,
			skip   : data.config === false,
		} } )

		if ( data.config === false ) return data.input
		const { build } = await import( 'esbuild' )
		await build( buildConfig )

		return data.output

	}

	return await catchError( run() )

}
