
import { zipFilesInDirectory } from '../../_shared/compress'
import { catchError }          from '../../_shared/error'
import {
	cancel,
	onCancel, 
}    from '../../_shared/process'

import type { BuilderContructorParams } from '../../types'

const compressConstructor = async ( {
	log, data,
}: BuilderContructorParams ) => {

	const compressOpts = {
		input  : data.binDir,
		output : data.compressDir,
	}
	
	log.debug( { compressOpts } )
	
	const run = async () => {

		const spinner       = log.spinner( 'Compressing binaries...' )
		let cancelRequested = false

		onCancel( () => {
	
			cancelRequested = true 
			spinner.fail( `Compresss ${compressOpts.input}: Cancelled!` )
			cancel()
	
		} )

		spinner.start()
	
		await zipFilesInDirectory( 
			compressOpts.input, 
			compressOpts.output, 
			v=> {

				if ( cancelRequested ) cancel()
				spinner.succeed( v )
		
			}, 
			n => {

				if ( cancelRequested ) cancel()
				spinner.fail( n )
			
			},
		)
		if ( cancelRequested ) cancel()

	}

	return await catchError( run() )

}

export const compress = async ( params: BuilderContructorParams ) => {

	const {
		log, 
		data,
		consts,
	} = params

	const compressLog = log.group( 'Compressing binaries...' )
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
