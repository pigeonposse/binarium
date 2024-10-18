/**
 * ESBUILD BUILD.
 *
 * @see https://esbuild.github.io/api/#build
 */
import { build } from 'esbuild'

import { catchError } from '../_shared/error'
import {
	existsPath,
	joinPath,
	packageDir,
	resolvePath, 
} from '../_shared/sys'

import type { Config } from './types'

type Opts = {
	input: string, 
	output: string, 
	target: string, 
	config?: Config['esbuild'] 
	isDebug?: boolean
	debug: ( data: object | string ) => void
}

export default async ( data: Opts ) => {

	if( data.config === false ) return

	const getTsConfig = async () =>{

		const userTs      = resolvePath( 'tsconfig.json' )
		const existUserTs = await existsPath( userTs )
		if( existUserTs ) return userTs
		return joinPath( packageDir, 'tsconfig.builder.json' )
	
	}

	const defConfig: NonNullable<Config['esbuild']> = {
		entryPoints : [ data.input ],
		minify      : true,
		bundle      : true,
		format      : 'cjs',
		platform    : 'node',
		target      : data.target,
		outfile     : data.output,
		tsconfig    : await getTsConfig(),
	} 
	
	const buildConfig = data.config ? {
		...defConfig,
		...data.config,
	} : defConfig
	
	data.debug( { esbuildConfig: buildConfig } )

	return await catchError( build( buildConfig ) )

}
