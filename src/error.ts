import type {
	BuilderErrors, 
	BuilderParams, 
} from './types'

export class BuildError extends Error {

	constructor( 
		message: BuilderErrors, 
		data: {
			platform: string
			arch: string
			opts: BuilderParams
		} & Record<string, unknown>, 
	) {

		super( message )
		this.name = this.constructor.name

		Object.assign( this, { data } )

		if ( Error.captureStackTrace ) Error.captureStackTrace( this, this.constructor )
	
	}

}
