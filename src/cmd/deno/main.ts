
import { buildBins } from './bin'
import { compress }  from '../_shared/compress'

import type { BuilderContructorParams } from '../../types'

export const buildDenoConstructor = async ( params: BuilderContructorParams ) => {

	const {
		data,
		consts,
		log,
	} = params

	log.info( 'Building Deno executables...', false )

	// BIN
	const binLog = log.group( 'Building binaries...' )
	binLog.start()

	const binTime = log.performance()
	
	const [ binError ] = await buildBins( params )
	if( binError ) {

		binLog.end( )
		throw new params.Error( consts.ERROR_ID.ON_DENO_COMPILE, {
			...data, 
			error : binError,
		} )
	
	}

	console.info( `\nTotal time: ${binTime.stop()} seconds.` )
	binLog.end( )

	if ( data.type === consts.BUILDER_TYPE.BIN ) return
	
	// COMPRESS
	await compress( params )

}
