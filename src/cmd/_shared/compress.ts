
import { zipFilesInDirectory } from '../../_shared/compress'
import { catchError }          from '../../_shared/error'

import type { BuilderContructorParams } from '../../types'

const compressConstructor = async ( {
	log, data,
}: BuilderContructorParams ) => {

	const compressOpts = {
		input  : data.binDir,
		output : data.compressDir,
	}
	
	log.debug( { compressOpts } )

	const spinner = log.spinner( 'Compressing binaries...' )

	return await catchError( zipFilesInDirectory( 
		compressOpts.input, 
		compressOpts.output, 
		n => spinner.info( n ), 
		n => spinner.fail( n ) ), 
	)

}

export const compress = async ( params: BuilderContructorParams ) => {

	const {
		log, 
		data,
		consts,
	} = params

	const compressLog = log.group( 'Compressing binaries...\n' )
	compressLog.start()
	const compressTime = log.performance()

	const [ compError ] = await compressConstructor( params )

	if( compError ) {

		compressLog.end()
		throw new params.Error( consts.ERROR_ID.ON_COMPRESSION, {
			...data, 
			error : compError,
		} )
	
	}

	console.info( `\nTotal time: ${compressTime.stop()} seconds.` )
	compressLog.end()

}
