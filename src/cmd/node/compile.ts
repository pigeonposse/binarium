/**
 * NCC BUILD.
 *
 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
 */

import { ncc }        from './ncc'
import { catchError } from '../../_shared/error'
import {
	deleteFile,
	writeFile,
} from '../../_shared/sys'
import { mergeCustom } from '../../_shared/vars'

import type { Config } from './types'

type Opts = {
	input    : string
	output   : string
	config?  : Config['ncc']
	isDebug? : boolean
	target?  : string
	debug    : ( data: object | string ) => void
}

export default async ( {
	input, output, debug, config, isDebug,
}: Opts ) => {

	type buildConfig = Config['ncc'] & { debugLog?: boolean }
	const defConfig:buildConfig = {
		minify   : true,
		cache    : false,
		debugLog : isDebug || false,
	}

	const merge = mergeCustom<buildConfig>( {} )

	const buildConfig = config
		? merge(
			defConfig,
			config,
		)
		: defConfig

	const build = async () => {

		debug( { ncc : {
			config : buildConfig,
			skip   : config === false,
		} } )

		if ( config === false ) return input

		const code = await ncc( {
			...buildConfig,
			input,
		} )

		// console.log( {
		// 	// code,
		// 	map,
		// 	assets,
		// } )

		await writeFile( output, code )
		await deleteFile( input )
		return output

	}

	return await catchError( build() )

}
