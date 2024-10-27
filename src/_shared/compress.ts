import archiver              from 'archiver'
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

// Function that handles the zipping of a single file
const zipFileWorker = ( sourceFilePath: string, zipName: string, outputDirectory: string, onDone: ( n: string ) => void, onError: ( n: string, err: Error ) => void ) => {

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

// Function to execute zipping in worker threads
const createZipForFileInThread = async ( sourceDirectory: string, file: string, outputDirectory: string, onDone: ( n: string ) => void, onError: ( n: string, err: Error ) => void ) => {

	const sourceFilePath = join( sourceDirectory, file )
	const zipName        = `${file}.zip`
	return zipFileWorker( sourceFilePath, zipName, outputDirectory, onDone, onError )

}

export const zipFilesInDirectory = async ( 
	sourceDirectory: string, 
	outputDirectory: string, 
	onDone: ( n: string ) => void = () => {}, 
	onError: ( n: string, err: Error ) => void = () => {}, 
) => {

	// Function to filter out invisible files
	const filter = ( file: string ) => !( /(^|\/)\.[^\\/\\.]/g ).test( file )

	// Ensure that the output directory exists or create it if it doesn't
	if ( !( await existsPath( outputDirectory ) ) ) await mkdir( outputDirectory, { recursive: true } )

	const files = await readdir( sourceDirectory )

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

		await Promise.all( chunk.map( file => createZipForFileInThread( sourceDirectory, file, outputDirectory, onDone, onError ) ) )
	
	} ) )

}
