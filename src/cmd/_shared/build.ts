import {
	cancel,
	execAndCapture,
	onCancel, 
} from '../../_shared/process'

import type { BuilderContructorParams } from '../../types'

export const buildBinWrappingCmd = async ( params: BuilderContructorParams, cmd: string, targetName: string ) => {

	const spinner = params.log.spinner( `Building ${targetName}...` )

	let cancelRequested = false

	onCancel( () => {

		cancelRequested = true 
		spinner.fail( `${targetName}: Cancelled!` )
		cancel()

	} )

	try {

		await execAndCapture( {
			cmd,
			onstdout : v => {

				if ( cancelRequested ) cancel()
				spinner.text( v )
		
			},
			onstderr : v => {

				if ( cancelRequested ) cancel()
				spinner.text( v )
		
			},
		} )
	
		if ( cancelRequested ) cancel()

		spinner.succeed( `${targetName} built.` )
	
	} catch ( e ) {

		spinner.fail( `${targetName}: ${e instanceof Error ? e.message : 'Unknown error'}` )
		throw e 

	}

}
