import archiver              from 'archiver'
import { globby }            from 'globby'
import { createWriteStream } from 'node:fs'
import {
	mkdir,
	readdir,
} from 'node:fs/promises'
import { cpus } from 'node:os'

import {
	existsPath,
	joinPath as join,
} from './sys'

export const getPaths = globby

// Function that handles the zipping of a single file
const _zipFileWorker = ( sourceFilePath: string, zipName: string, outputDirectory: string, onDone: ( n: string ) => void, onError: ( n: string, err: Error ) => void ) => {

	return new Promise<void>( ( resolve, reject ) => {

		const output  = createWriteStream( join( outputDirectory, zipName ) )
		const archive = archiver( 'zip', { zlib: { level: 6 } } ) // Reduced compression level for speed

		output.on( 'close', () => {

			onDone( zipName )
			resolve()

		} )

		archive.on( 'error', err => {

			onError( zipName, err )
			reject( err )

		} )

		archive.pipe( output )
		archive.file( sourceFilePath, { name: zipName.replace( '.zip', '' ) } )
		archive.finalize()

	} )

}

export const zipDir = async ( data: {
	/** input directory */
	input    : string
	/** output directory */
	output   : string
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
} ) => {

	const {
		input, output, onDone, onError,
	} = data
	// Function to execute zipping in worker threads
	const createZipForFileInThread = async ( sourceDirectory: string, file: string, outputDirectory: string, onDone: ( n: string ) => void = () => {}, onError: ( n: string, err: Error ) => void = () => {} ) => {

		const sourceFilePath = join( sourceDirectory, file )
		const zipName        = `${file}.zip`
		return _zipFileWorker( sourceFilePath, zipName, outputDirectory, onDone, onError )

	}

	// Function to filter out invisible files
	const filter = ( file: string ) => !( /(^|\/)\.[^\\/\\.]/g ).test( file )

	// Ensure that the output directory exists or create it if it doesn't
	if ( !( await existsPath( output ) ) ) await mkdir( output, { recursive: true } )

	const files = await readdir( input )

	// Filter out invisible files
	const visibleFiles = files.filter( filter )

	// Get available CPUs for worker threads
	const cpuCount = cpus().length

	// Split the files to be processed in chunks based on CPU cores
	const fileChunks = []
	for ( let i = 0; i < visibleFiles.length; i += cpuCount ) {

		fileChunks.push( visibleFiles.slice( i, i + cpuCount ) )

	}

	// Process each chunk in parallel using workers
	await Promise.all( fileChunks.map( async chunk => {

		await Promise.all( chunk.map( file => createZipForFileInThread( input, file, output, onDone, onError ) ) )

	} ) )

}

export const zipPaths = async ( data:{
	/** input patterns */
	input    : string[]
	/** output directory */
	output   : string
	/** input options */
	opts?    : Parameters<typeof getPaths>[1]
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
} ) => {

	const {
		input, output, opts, onDone, onError,
	} = data

	const createZipForFileInThread = async ( filePath: string, outputDirectory: string, onDone: ( n: string ) => void = () => {}, onError: ( n: string, err: Error ) => void  = () => {} ) => {

		const fileName = filePath.split( '/' ).pop() || 'file' // Extract file name
		const zipName  = `${fileName}.zip`
		return _zipFileWorker( filePath, zipName, outputDirectory, onDone, onError )

	}

	// Function to filter out invisible files
	const filter = ( file: string ) => !( /(^|\/)\.[^\\/\\.]/g ).test( file )

	// Use globby to resolve the file paths based on patterns
	const resolvedPaths = await getPaths( input, opts )

	// Filter out invisible files
	const visibleFiles = resolvedPaths.filter( filter )

	// Ensure the output directory exists
	if ( !( await existsPath( output ) ) ) {

		await mkdir( output, { recursive: true } )

	}

	// Get available CPUs for parallel processing
	const cpuCount = cpus().length

	// Split the files to be processed in chunks based on CPU cores
	const fileChunks = []
	for ( let i = 0; i < visibleFiles.length; i += cpuCount ) {

		fileChunks.push( visibleFiles.slice( i, i + cpuCount ) )

	}

	// Process each chunk in parallel
	await Promise.all(
		fileChunks.map( async chunk => {

			await Promise.all(
				chunk.map( file => createZipForFileInThread( file, output, onDone, onError ) ),
			)

		} ),
	)

}
