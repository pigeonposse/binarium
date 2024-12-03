/**
 * PKG BUILD.
 * @see https://www.npmjs.com/package/@yao-pkg/pkg
 */

import { catchError } from '../../_shared/error'
import {
	deleteFile,
	getDirname,
	joinPath,
	writeFile,
} from '../../_shared/sys'

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
	input, output, name, debug, config, isDebug, assets, targets,
}: Opts ) => {

	const mergedAssets = [ ...( assets?.map( d => d.to ) || [] ), ...( config?.assets || [] ) ]

	const pkgConf = {
		bin  : config?.input || input,
		name : config?.name || name,
		pkg  : {
			targets    : config?.targets || targets,
			outputPath : config?.output || output,
			scripts    : config?.scripts || undefined,
			assets     : mergedAssets.length ? mergedAssets : config?.assets,
			ignore     : config?.ignore || undefined,
			compress   : config?.compress || 'Gzip',
		},
	}

	const tempFile = joinPath( getDirname( input ), 'pkg.config.json' )

	const buildConfig = [
		tempFile,
		...( isDebug ? [ '--debug' ] : [] ),
		...( config?.flags ? config.flags : [ ] ),
	]

	debug( { pkg : {
		conf : pkgConf,
		cmd  : buildConfig,
	} } )

	const run = async () => {

		const { exec } = await import( '@yao-pkg/pkg' )
		await writeFile( tempFile, JSON.stringify( pkgConf, null, 2 ) )
		await exec( buildConfig )
		await deleteFile( tempFile )

	}

	return await catchError( run() )

}
