
import { getPaths } from '../../_shared/sys'

import type { BuilderContructorParams } from 'types'

export const printResults = async ( params: BuilderContructorParams ) => {

	const {
		data, log, consts,
	} = params

	if( data.type === consts.BUILDER_TYPE.BUNDLE ) return
	
	console.log()
	const paths = await getPaths( [ params.data.binDir ] )
	log.info( 'Binaries created:\n', false )

	for ( const path of paths ) {

		const s = log.spinner( '' )
		s.info( path )
	
	}
	
	if( data.type !== consts.BUILDER_TYPE.BIN ) {

		console.log()
		const s = log.spinner( '' )
		s.info( 'Compressed in: ' + params.data.compressDir )
	
	}

}
