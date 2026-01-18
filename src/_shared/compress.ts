import { zip }      from 'compressing'
import { readdir }  from 'node:fs/promises'
import { cpus }     from 'node:os'
import { basename } from 'node:path'

import {
	ensureDir,
	getPaths,
	joinPath as join,
} from './sys'

const _mapParallel = async <T>(
	items: T[],
	limit: number,
	fn: ( item: T ) => Promise<void>,
) => {

	for ( let i = 0; i < items.length; i += limit ) {

		await Promise.all( items.slice( i, i + limit ).map( fn ) )

	}

}

const _zipFileWorker = async (
	sourceFilePath: string,
	zipName: string,
	outputDirectory: string,
	onDone: ( n: string ) => void,
	onError: ( n: string, err: Error ) => void,
) => {

	try {

		const destPath = join( outputDirectory, zipName )
		await zip.compressFile( sourceFilePath, destPath, { level: 6 } )
		onDone( zipName )

	}
	catch ( err ) {

		onError( zipName, err as Error )

	}

}

export const zipDir = async ( data: {
	input    : string
	output   : string
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
} ) => {

	const {
		input, output, onDone = () => {}, onError = () => {},
	} = data
	const filter = ( file: string ) => !/(^|\/)\.[^\\/\\.]/g.test( file )

	await ensureDir( output )

	const entries      = await readdir( input )
	const visibleFiles = entries.filter( filter )

	await _mapParallel( visibleFiles, cpus().length, file =>
		_zipFileWorker( join( input, file ), `${file}.zip`, output, onDone, onError ),
	)

}

export const zipPaths = async ( data: {
	input    : string[]
	output   : string
	opts?    : Parameters<typeof getPaths>[1]
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
} ) => {

	const {
		input, output, opts, onDone = () => {}, onError = () => {},
	} = data
	const filter = ( file: string ) => !/(^|\/)\.[^\\/\\.]/g.test( file )

	const resolvedPaths = await getPaths( input, opts )
	const visibleFiles  = resolvedPaths.filter( filter )

	await ensureDir( output )

	await _mapParallel( visibleFiles, cpus().length, filePath => {

		const fileName = basename( filePath )
		return _zipFileWorker( filePath, `${fileName}.zip`, output, onDone, onError )

	} )

}
