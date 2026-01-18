
import { deserialize as tomlParse } from '@structium/toml'
import { deserialize as yamlParse } from '@structium/yaml'
import { globby }                   from 'globby'
import { randomUUID }               from 'node:crypto'
import {
	readFile,
	mkdir,
	writeFile as fsWriteFile,
	access,
	unlink,
	stat,
	rm,
	copyFile,
} from 'node:fs/promises'
import {
	arch,
	platform,
	tmpdir,
} from 'node:os'
import {
	parse,
	dirname,
	join,
	resolve,
	extname,
	basename,
	isAbsolute,
	relative,
} from 'node:path'
import {
	fileURLToPath,
	pathToFileURL,
} from 'node:url'

export * as http from 'node:http'
export * as https from 'node:https'

export {
	fileURLToPath,
	pathToFileURL,
	readFile,
}

export const getPaths = globby
export const packageDir = fileURLToPath( new URL( '..', import.meta.url ) )
export const joinPath = join
export const resolvePath = resolve
export const relativePath = relative
export const relative2cwd = ( path: string ) => relative( process.cwd(), path )
export const isAbsolutePath = isAbsolute
export const getBasename = basename
export const getFilename = ( path: string ) => {

	const { name } = parse( path )
	return name.endsWith( '.' ) ? name.slice( 0, -1 ) : name

}
export const getRandomUUID = () => randomUUID()
export const getTempDir = tmpdir
export const getDirname = dirname
export const deleteFile = async ( path: string ) => {

	await unlink( path )

}
export const existsPath = async ( path: string ) => {

	try {

		await access( path )
		return true

	}
	catch ( _e ) {

		return false

	}

}
export const writeFile = async ( path: string, data: string ) => {

	const dir = getDirname( path )

	await mkdir( dir, { recursive: true } )

	await fsWriteFile( path, data, 'utf8' )

}

export const getArch = () => {

	const architecture = arch()

	switch ( architecture ) {

		case 'arm64' :
			return 'arm64'
		case 'arm' :
			return 'arm64'
		case 'x64' :
			return 'x64'
		default :
			return 'unknown'

	}

}

export const getPlatform = async () => {

	const p = platform()

	switch ( p ) {

		case 'win32' :
			return 'win'
		case 'darwin' :
			return 'macos'
		case 'linux' :
			return 'linux'
		default :
			return 'unknown'

	}

}

export const removePathIfExist = async ( path: string ) => {

	try {

		// Check if the path exists
		const stats = await stat( path )

		if ( stats.isDirectory() ) {

			// If it's a directory, delete it recursively
			await rm( path, {
				recursive : true,
				force     : true,
			} )
			// console.log( `Directory ${path} successfully deleted.` )

		}
		else if ( stats.isFile() ) {

			// If it's a file, delete it
			await unlink( path )
			// console.log( `File ${path} successfully deleted.` )

		}

	}
	catch ( error ) {

		// @ts-ignore
		// `The directory or file ${path} does not exist.`
		if ( error.code === 'ENOENT' ) return
		else console.error( `Error deleting ${path}:`, error )

	}

}

/**
 * Reads a configuration file and returns the parsed content.
 *
 * @param   {string}          filePath - The path to the configuration file.
 * @returns {Promise<object>}          - The parsed content of the configuration file.
 * @throws {Error} - If the file extension is not supported.
 * @example ``
 */
export const readConfigFile = async ( filePath: string ): Promise<object> => {

	const ext     = extname( filePath )
	const content = await readFile( filePath, 'utf8' )
	let res

	if ( ext === '.json' ) {

		res = JSON.parse( content )

	}
	else if ( ext === '.yml' || ext === '.yaml' ) {

		res = yamlParse( content )

	}
	else if ( ext === '.toml' || ext === '.tml' ) {

		res = tomlParse( content )

	}
	else if ( ext === '.js' || ext === '.mjs' ) {

		const modulePath = pathToFileURL( filePath ).href
		res              = ( await import( modulePath ) ).default

	}
	else {

		throw new Error( `Unsupported file extension: ${ext}` )

	}

	return res

}

export const copyDir = async ( {
	from, to,
}:{
	from : string
	to   : string
} ) => {

	const includes: string[] = []

	if ( await existsPath( to ) )
		throw new Error( `Directory [${to}] already exists` )

	const paths = await getPaths( [ from ] )

	for ( const path of paths ) {

		const fromPath = resolve( path )
		const toPath   = join( to, basename( path ) )

		await mkdir( dirname( toPath ), { recursive: true } )

		if ( !( await existsPath( fromPath ) ) )
			throw new Error( `Source file ${fromPath} does not exist` )

		await copyFile( fromPath, toPath )
		includes.push( toPath )

	}

	return includes

}

export const ensureDir = async ( path: string ) => {

	if ( !( await existsPath( path ) ) ) await mkdir( path, { recursive: true } )

}
