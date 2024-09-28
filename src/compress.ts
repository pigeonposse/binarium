
import archiver from 'archiver'
import {
	createWriteStream, 
	existsSync, 
} from 'node:fs'
import {
	mkdir,
	readdir,
} from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Zips the files in the specified source directory and saves them to the output directory.
 *
 * @param {string} sourceDirectory - The path to the source directory containing files to zip.
 * @param {string} outputDirectory - The path to the output directory where zip files will be saved.
 * @example ''
 *
 */
export const zipFilesInDirectory = async ( sourceDirectory: string, outputDirectory: string ) => {

	// Function to filter out invisible files
	const filter = ( file: string ) => !( /(^|\/)\.[^\\/\\.]/g ).test( file )

	// Check if directory paths are provided
	if ( !sourceDirectory || !outputDirectory ) {

		throw new Error( 'Please provide both source directory and output directory paths as arguments.' )
	
	}

	// Ensure that the output directory exists or create it if it doesn't
	if ( !existsSync( outputDirectory ) ) {

		await mkdir( outputDirectory, { recursive: true } )
	
	}
	const createZipForFile = ( file: string ) => {

		return new Promise<void>( ( resolve, reject ) => {

			const sourceFilePath = join( sourceDirectory, file )
			const zipName        = `${file}.zip`
			const output         = createWriteStream( join( outputDirectory, zipName ) )
			const archive        = archiver( 'zip', { zlib: { level: 9 } } )

			output.on( 'close', () => {

				console.log( `👍 Zip file [${zipName}] created successfully` )
				resolve()
	
			} )

			archive.on( 'error', err => {

				console.error( `💥 Error creating ${zipName}:`, err )
				reject( err )
	
			} )

			archive.pipe( output )
			archive.file( sourceFilePath, { name: file } )
	
			archive.finalize()
		
		} )

	}
	
	try {

		// Read the source directory
		const files = await readdir( sourceDirectory )
	
		// Filter out invisible files
		const visibleFiles = files.filter( filter )
	
		// Create a ZIP file for each visible file
		await Promise.all( visibleFiles.map( createZipForFile ) )

	} catch ( error ) {

		console.error( 'Error processing files:', error )
		throw error

	}

}
