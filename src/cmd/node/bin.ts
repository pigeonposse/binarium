/**
 * PKG BUILD.
 *
 * @see https://www.npmjs.com/package/@yao-pkg/pkg
 */

import { pkg }        from './pkg'
import { catchError } from '../../_shared/error'
import { getDirname } from '../../_shared/sys'

import type { Config }       from './types'
import type { ConfigParams } from '../../types'

type Opts = {
	input    : string
	output   : string
	name     : string
	targets  : string[]
	assets?  : ConfigParams['assets']
	config?  : Config['pkg']
	debug    : ( data: object | string ) => void
	isDebug? : boolean
}

export default async ( {
	input, output, name, config, isDebug, assets, targets,
}: Opts ) => {

	const mergedAssets = [ ...( assets?.map( d => d.to ) || [] ), ...( config?.assets || [] ) ]
	const _assets      = mergedAssets.length ? mergedAssets : config?.assets

	const run = async () => {

		return await pkg( {
			...config,
			input,
			output,
			name,
			targets,
			assets : _assets,
		}, {
			isDebug,
			tempDir : getDirname( input ),
		} )

	}

	return await catchError( run() )

}
