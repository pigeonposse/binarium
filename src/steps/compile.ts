/**
 * NCC BUILD.
 *
 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
 */
// @ts-ignore
import ncc from '@vercel/ncc'

import { catchError } from '../_shared/error'
import {
	deleteFile,
	writeFile, 
} from '../_shared/sys'

import type { Config } from './types'

type Opts = {
	input: string, 
	output: string, 
	config?: Config['ncc']
	isDebug?: boolean
	debug: ( data: object | string ) => void
}

export default async ( {
	input, output, debug, config, isDebug,
}: Opts ) => {
	
	if( config === false ) return

	const defConfig = {
		minify   : true,
		cache    : false,
		debugLog : isDebug || false,
		// target,
	} 
	
	const buildConfig = config ? {
		...defConfig,
		...config,
	} : defConfig

	const build = async () => {

		const { code } = await ncc( input, buildConfig )
	
		await writeFile( output, code )
		await deleteFile( input )
	
	}

	debug( { nccOpts: buildConfig } )

	return await catchError( build() )

}
