
import {
	spawn,
	exec as execChild,
} from 'node:child_process'
import appProcess, {
	argv,
	exit,
} from 'node:process'
import { promisify } from 'node:util'

export { exit }

/**
 * This is not recomended but is for not display `(node:31972) [DEP0040] DeprecationWarning:
 * The `punycode` module is deprecated. Please use a userland alternative instead.` message.
 *
 * @example setNoDeprecationAlerts()
 */
export const setNoDeprecationAlerts = () => {

	// @ts-ignore
	appProcess.noDeprecation = true

}
export const onExit = ( cb: NodeJS.ExitListener ) => {

	appProcess.on( 'exit', cb )

}

export const cancel = () => exit( 130 )

export const onCancel = ( cb: NodeJS.ExitListener ) => {

	appProcess.on( 'SIGINT', cb )

}

export const getFlagValue = ( key: string, isAlias = false ) => {

	const flagLine = isAlias || key.length === 1 ? '-' : '--'
	const flags    = argv
	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value
		if ( flag.startsWith( `${flagLine}${key}=` ) )
			return flag.split( '=' )[1]

		// Formato --key value
		if ( flag === `${flagLine}${key}` && flags[i + 1] && !flags[i + 1].startsWith( flagLine ) )
			return flags[i + 1]

	}
	return undefined

}

export const getFlagValues = ( key: string,	isAlias = false ): string[] | undefined => {

	const flags    = argv
	const flagLine = isAlias || key.length === 1 ? '-' : '--'

	let values: string[] = []

	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value1,value2,...
		if ( flag.startsWith( `${flagLine}${key}=` ) ) {

			values = flag.split( '=' )[1].split( ',' )
			break

		}

		// Formato --key value1 value2 ...
		if ( flag === `${flagLine}${key}` ) {

			for ( let j = i + 1; j < flags.length; j++ ) {

				if ( flags[j].startsWith( flagLine ) ) break
				values.push( flags[j] )

			}
			break

		}

	}
	return values.length > 0 ? values : undefined

}

export const existsFlag = ( v: string, isAlias = false ) => {

	const flagLine = isAlias || v.length === 1 ? '-' : '--'
	return argv.includes( `${flagLine}${v}` )

}

export const existsCmd = ( v: string ) => argv.includes( v )
export const noFlags = () => argv.length <= 2

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

export const execAndCapture = async ( {
	cmd, onstdout, onstderr,
}:{
	cmd       : string
	onstdout? : ( data: string ) => void
	onstderr? : ( data: string ) => void
} ): Promise<void> => {

	return new Promise<void>( ( resolve, reject ) => {

		let hasExited      = false
		const childProcess = spawn( cmd, {
			shell : true,
			stdio : 'pipe',
		} )

		childProcess.stdout.on( 'data', data => {

			if ( data instanceof Error ) reject( data )
			const output = data.toString()
			if ( onstdout ) onstdout( output )

		} )

		childProcess.stderr.on( 'data', data => {

			if ( data instanceof Error ) reject( data )
			const errorOutput = data.toString()

			if ( onstderr ) onstderr( errorOutput )

		} )

		childProcess.on( 'close', code => {

			hasExited = true
			if ( code === 0 ) {

				resolve()

			}
			else if ( code === 130 ) {

				const error = new Error( 'Command aborted!' )
				reject( error )

			}
			else {

				const error = new Error( `Command failed with code ${code}` )
				reject( error )

			}

		} )

		childProcess.on( 'error', err => {

			if ( !hasExited )
				reject( new Error( `Process exited with error: ${err.message}` ) )

		} )

	} )

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FnDefault = () => Promise<any>
type OnWriteParams<FN extends FnDefault> = {
	fn : FN

	on : ( value:string ) => Promise<string | undefined>
}
export const onOutputWrite = async <FN extends FnDefault>( {
	fn, on,
}: OnWriteParams<FN> ): Promise<ReturnType<FN>> => {

	const originalWrite = appProcess.stdout.write

	// @ts-ignore
	appProcess.stdout.write = async ( chunk, ...args ) => {

		const value     = chunk.toString()
		const validated = await on( value )

		// @ts-ignore
		if ( validated ) originalWrite.call( stdout, chunk, ...args )

	}

	try {

		// Llamamos a la función original
		return await fn()

	}
	finally {

		// Restauramos appProcess.stdout.write a su comportamiento original
		appProcess.stdout.write = originalWrite

	}

}

export const existsJSRuntimes = async () => {

	const binaries = [
		'deno',
		'node',
		'bun',
	] as const

	type Bins = ( typeof binaries )[number][]
	const existingBinaries: Bins = []

	// Crea un array de promesas para cada binario
	const checks = binaries.map( async bin => {

		const command = process.platform === 'win32' ? `where ${bin}` : `which ${bin}`

		try {

			await promisify( execChild )( command )
			existingBinaries.push( bin )

		}
		catch ( _e ) {
			// Si ocurre un error, simplemente lo ignoramos (el binario no existe)
		}

	} )

	await Promise.all( checks )
	return existingBinaries

}
