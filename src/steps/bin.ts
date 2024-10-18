/**
 * PKG BUILD.
 *
 * @see https://www.npmjs.com/package/@yao-pkg/pkg
 */
import { exec as execPkg } from '@yao-pkg/pkg'

import { catchError } from '../_shared/error'
import { joinPath }   from '../_shared/sys'

import type { Config } from './types'

type Opts = {
	input: string, 
	output: string, 
	name: string,
	targets: string[], 
	config?: Config['pkg']
	debug: ( data: object | string ) => void
	isDebug?: boolean
}

export default async ( {
	input, output, name, targets, debug, config, isDebug, 
}: Opts ) => {

	const defConfig = [
		input,
		'--targets',
		targets.join( ',' ),
		'--output',
		joinPath( output, name ),
		'--compress',
		'GZip', 
		...( isDebug ? [ '--debug' ] : [] ),
	]
	
	const buildConfig = config ? [ ...defConfig, ...config ] : defConfig

	debug( { pkgOpts: buildConfig } )
	return await catchError( execPkg( buildConfig ) )

}
