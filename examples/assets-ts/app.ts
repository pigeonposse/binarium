#!/usr/bin/env node

import {
	readFile,
	readdir,
} from 'node:fs/promises'
import {
	join,
	dirname, 
} from 'node:path'
import {
	argv,
	argv0,
	cwd,
	execPath, 
} from 'node:process'
import { fileURLToPath } from 'node:url'

type Flags = {
	read: string;
	paths: string;
	ls: string;	
	cat: string;
	help: boolean;
}
/* eslint-disable jsdoc/require-jsdoc */

function showHelp() {

	const name = 'binarium-assets-test'
	console.log( `
Usage: ${name} [options]

Options:

--help       Show this help message
--read       Read asset setting the name of the asset
--paths      Show bin paths
--ls         List specific bin paths
` )

}

const getPaths = async ( dirPath: string ) => {

	try {

		const paths: string[] = []
		const files           = await readdir( dirPath )
    
		for ( const file of files ) {

			const fullPath = join( dirPath, file )
      
			try {

				paths.push( fullPath )
			
			} catch ( err ) {

				console.error( `Error reading file: ${err.message}` )
			
			}
		
		}
		return paths
	
	} catch ( err ) {

		console.error( `Error reading directory: ${err.message}` )
	
	}

}

function parseArgs(): Flags {

	const args  = process.argv.slice( 2 )
	const flags = {}

	for ( let i = 0; i < args.length; i++ ) {

		const arg = args[ i ]
		if ( arg.startsWith( '--' ) ) {

			const flagName = arg.slice( 2 ) 
			const nextArg  = args[ i + 1 ]
			if ( nextArg && !nextArg.startsWith( '--' ) ) {

				// @ts-ignore
				flags[ flagName ] = nextArg
				i++ // Saltar al siguiente argumento
		
			} else {

				// @ts-ignore
				flags[ flagName ] = true
		
			}
	
		}

	}

	return flags as Flags

}
const convertError = ( data: unknown ) => data instanceof Error ? {
	message : data.message,
	stack   : data.stack ? data.stack.split( '\n' ) : [], // Convertir el stack a un array
	name    : data.name,
} : data

const __dirname = dirname( fileURLToPath( import.meta.url ) )
const workspace = join( __dirname, '..', '..' )
const system    = join( workspace, '..' )

async function main() {

	const flags = parseArgs()

	if ( flags.help ) showHelp()
	else {

		if ( flags.read ) {

			try {

				const path = join( __dirname, 'public', flags.read )
				const data = await readFile( path, 'utf8' )

				console.log( {
					path,
					data : data.toString(),
				} )
			
			} catch ( error ) {

				console.error( JSON.stringify( {
					id    : 'Error Reading file',
					error : convertError( error ),
				}, undefined, 2 ) )
			
			}
		
		}else if ( flags.paths ){

			console.log( {
				dir            : __dirname,
				dirPaths       : await getPaths( __dirname ),
				workspace,
				workspacePaths : await getPaths( workspace ),
				system,
				systemPaths    : await getPaths( system ),
				cwd            : cwd(),
				execPath,
				argv,
				argv0,
			} )
		
		} else if( flags.ls ) {

			console.log( `ls ${flags.ls}` )
			const paths = await getPaths( flags.ls )
			console.log( { paths } )
		
		}
		else if( flags.cat ) {

			const content = await readFile( flags.cat, 'utf8' )
			console.log( content )
		
		}
		else showHelp()
	
	}

}

main()

