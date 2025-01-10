import {
	readdir,
	lstat,
	access,
} from 'node:fs/promises'
import {
	dirname,
	resolve,
	join,
} from 'node:path'
import { fileURLToPath } from 'node:url'

export { join }

export const getCurrFileDir = ( path: string = import.meta.url ) => {

	const __dirname = dirname( fileURLToPath( path ) )
	return __dirname

}

const existsPath = async ( path: string ) => {

	try {

		await access( path )
		return true

	}
	catch ( _e ) {

		return false

	}

}
const dirPath    = resolve( process.cwd(), 'build/bin' )

export const showBinPaths = async () => {

	try {

		const exists = await existsPath( dirPath )
		if ( !exists ) return
		const files = await readdir( dirPath )

		console.log( 'Execute bin paths:' )
		for ( const file of files ) {

			const fullPath = join( dirPath, file )

			try {

				const stats = await lstat( fullPath )

				if ( stats.isFile() ) {

					console.log( fullPath )

				}

			}
			catch ( e ) {

				if ( e instanceof Error )
					console.error( `Error reading file: ${e.message}` )
				else console.error( e )

			}

		}

	}
	catch ( e ) {

		if ( e instanceof Error )
			console.error( `Error reading directory: ${e.message}` )
		else console.error( e )

	}

}

