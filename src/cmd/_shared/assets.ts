import {
	copyDir,
	removePathIfExist,
} from '../../_shared/sys'

import type { BuilderContructorParams } from '../../types'

export const assetsConstructor = async ( {
	log, data,
}: BuilderContructorParams ) => {

	let includes: string[] = []

	if ( data.assets && data.assets.length ) {

		log.info( 'Copying assets...' )
		for ( const asset of data.assets ) {

			const includedFiles = await copyDir( asset )
			includes            = [ ...includedFiles, ...includes ]

		}

	}

	const rm =  async ( ) => {

		if ( !( data.assets && data.assets.length ) ) return

		for ( const asset of data.assets ) {

			await removePathIfExist( asset.to )

		}

	}

	return {
		includes : includes.length ? includes : undefined,
		rm,
	}

}
