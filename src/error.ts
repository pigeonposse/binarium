import type { BuilderErrors } from './types'

export class BuildError extends Error {

	constructor( 
		message: BuilderErrors, 
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any,
		// data: {
		// 	platform: string
		// 	arch: string
		// 	opts: any
		// } & Record<string, unknown>, 
	) {

		super( message )
		this.name = this.constructor.name

		Object.assign( this, { data } )

		if ( Error.captureStackTrace ) Error.captureStackTrace( this, this.constructor )
	
	}

}
