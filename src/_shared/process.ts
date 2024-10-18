
import { spawn } from 'node:child_process'
import process   from 'node:process'

export const exit = process.exit

/**
 * This is not recomended but is for not display `(node:31972) [DEP0040] DeprecationWarning: 
 * The `punycode` module is deprecated. Please use a userland alternative instead.` message.
 *
 * @example setNoDeprecationAlerts()
 * 
 */
export const setNoDeprecationAlerts = () => {

	// @ts-ignore
	process.noDeprecation = true

}
export const onExit = ( cb: NodeJS.ExitListener ) => {
	
	process.on( 'exit', cb )

}

export const getFlagValue = ( key: string ) =>{

	const flags = process.argv
	for ( const flag of flags ) {

		if ( flag.startsWith( `--${key}=` ) ) return flag.split( '=' )[ 1 ]
	
	}
	return undefined

}
export const existsFlag = ( v: string ) => process.argv.includes( `--${v}` )

export const exec = async ( cmd: string ) => {
 
	await new Promise<void>( ( resolve, reject ) => {

		const childProcess = spawn( cmd, {
			shell : true,
			stdio : 'inherit',
		} )

		childProcess.on( 'close', code => {

			if ( code === 0 ) resolve()
			else {

				const error = new Error( `Command failed with code ${code}` )
				console.error( error )
				reject( error )
				
			}
			
		} )
		
	} )

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FnDefault = () => Promise<any>
type OnWriteParams<FN extends FnDefault> = {
	fn : FN
	
	// eslint-disable-next-line no-unused-vars
	on( value:string ): Promise<string | undefined>
}
export const onOutputWrite = async <FN extends FnDefault>( {
	fn, on, 
}: OnWriteParams<FN> ): Promise<ReturnType<FN>> => {

	const originalWrite = process.stdout.write
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	stdout.write = async ( chunk, ...args ) => {

		const value     = chunk.toString()
		const validated = await on( value )
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if ( validated ) originalWrite.call( stdout, chunk, ...args )
	
	}

	try {

		// Llamamos a la función original
		return await fn()

	} finally {

		// Restauramos process.stdout.write a su comportamiento original
		process.stdout.write = originalWrite
	
	}

}
