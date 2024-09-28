/**
 * PACKAGE FILE.
 *
 * @description File with build function.
 */
// @ts-ignore
import ncc                 from '@vercel/ncc'
import { exec as execPkg } from '@yao-pkg/pkg'

import { zipFilesInDirectory } from './compress'
import {
	ERROR_ID, 
	target, 
	name,
	BUILDER_TYPE,
	ARCH,
} from './const'
import { BuildError } from './error'
import { logger }     from './logger'
import {
	deleteFile,
	existsFlag,
	existsPath,
	getArch, 
	getFilename, 
	getFlagValue, 
	getPlatform, 
	joinPath,
	packageDir,
	resolvePath,
	writeFile,
} from './utils'

import type { BuilderParams } from './types'

export type * from './types'

export const BINARIUM_CONSTS: { name?: string, debug?: boolean } = {
	name  : undefined,
	debug : undefined, 
}

/**
 * FUNCTIONS.
 */

export const buildConstructor = async ( { 
	input,
	name, 
	outDir = resolvePath( 'build' ),
	onlyOs = false,
	type = BUILDER_TYPE.ALL, 
	log,
}: BuilderParams & { log: ReturnType<typeof logger> } ) => {

	const arch         = await getArch()
	const plat         = await getPlatform()
	const projectBuild = outDir 
	
	const params =  Object.assign( {}, { 
		input,
		name, 
		outDir,
		onlyOs,
		type, 
	} )
	const flags  = {
		input  : getFlagValue( 'input' ), 
		onlyOs : existsFlag( 'onlyOs' ),
		outDir : getFlagValue( 'outDir' ),
		type   : getFlagValue( 'type' ) as typeof type,
		name   : getFlagValue( 'name' ),
	}
	if( flags.name ) name = flags.name
	if( flags.input ) input = flags.input
	if( flags.onlyOs ) onlyOs = flags.onlyOs
	if( flags.outDir ) outDir = flags.outDir
	if( flags.type && Object.values( BUILDER_TYPE ).includes( flags.type ) ) type = flags.type 

	if( !name ) name = getFilename( input )
		
	const opts = {
		input,
		name, 
		outDir,
		onlyOs,
		type, 
	}
	const data = {
		platform : plat,
		arch,
		opts,
	}

	const projectBuildBin       = joinPath( projectBuild, 'bin' )
	const projectBuildZip       = joinPath( projectBuild, 'zip' )
	const projectBuildCjs       = joinPath( projectBuild, 'cjs' )
	const projectBuildCjsFile   = joinPath( projectBuildCjs, 'node.cjs' )
	const projectBuildIndexFile = joinPath( projectBuildCjs, 'index.cjs' )

	// GET TARGETS
	const getTargets = ( arch: typeof ARCH[keyof typeof ARCH] ) => ( onlyOs ? [ `${target}-${plat}-${arch}` ] : [
		`${target}-alpine-${arch}`,
		`${target}-linux-${arch}`,
		`${target}-linuxstatic-${arch}`,
		`${target}-macos-${arch}`,
		`${target}-win-${arch}`,
	] )
	
	const targets = arch === ARCH.ARM64 
		? [ ...getTargets( ARCH.ARM64 ), ...getTargets( ARCH.X64 ) ] 
		: getTargets( ARCH.X64 )
	
	log.debug( JSON.stringify( {
		message : 'Init data: function params, process flags, final options..',
		data    : {
			params, 
			flags,
			...data, 
			targets,
		},
	}, null, 2 ) )

	// EXIST INPUT
	const getInput = async ( path: string ) => {

		const validExtensions = [
			'.ts',
			'.js',
			'.mjs',
			'.mts',
			'.cjs',
			'.cts',
		]

		if( !validExtensions.some( ext => path.endsWith( ext ) ) ){

			for ( let index = 0; index < validExtensions.length; index++ ) {
				
				const input = path + validExtensions[ index ]

				const exists = await existsPath( input )
				if( exists ) return input
			
			}
			return undefined
		
		}
		const exists = await existsPath( path )
		if( exists ) return path
		return undefined
	
	}

	const exists = await getInput( input )
	if( !exists ) throw new BuildError( ERROR_ID.NO_INPUT, data )
	else input = exists

	if( plat === 'unknown' ) throw new BuildError( ERROR_ID.PLATFORM_UNKWON, data )
		
	/**
	 * ESBUILD BUILD.
	 *
	 * @see https://esbuild.github.io/api/#build
	 */
	const esbuildLog = log.group( 'Building cjs file...' )
	esbuildLog.start()
	const { build } = await import( 'esbuild' )

	const getTsConfig = async () =>{

		const userTs      = resolvePath( 'tsconfig.json' )
		const existUserTs = await existsPath( userTs )
		if( existUserTs ) return userTs
		return joinPath( packageDir, 'tsconfig.builder.json' )
	
	}

	await build( {
		entryPoints : [ input ],
		minify      : true,
		bundle      : true,
		format      : 'cjs',
		platform    : 'node',
		target,
		outfile     : projectBuildCjsFile,
		tsconfig    : await getTsConfig(),
	} ).catch( err => {

		esbuildLog.end()
		throw new BuildError( ERROR_ID.ON_ESBUILD, {
			...data, 
			error : err,
		} )
	
	} )
	esbuildLog.end()

	/**
	 * NCC BUILD.
	 *
	 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
	 */

	const nccLog = log.group( 'Converting cjs file in a single file...' )
	nccLog.start()
	const { code } = await ncc( projectBuildCjsFile, {
		minify : true,
		cache  : false,
		// target,
	} ).catch( ( error: unknown ) => {

		nccLog.end()
		throw new BuildError( ERROR_ID.ON_NCC, {
			...data, 
			error,
		} )
	
	} )
	nccLog.end()

	await writeFile( projectBuildIndexFile, code )
	await deleteFile( projectBuildCjsFile )

	if ( type === BUILDER_TYPE.CJS ) return

	/**
	 * PKG BUILD.
	 *
	 * @see https://www.npmjs.com/package/@yao-pkg/pkg
	 */

	const pkgLog = log.group( 'Creating binaries...' )
	pkgLog.start()

	await execPkg( [
		projectBuildIndexFile,
		'--targets',
		targets.join( ',' ),
		'--output',
		joinPath( projectBuildBin, name ),
		'--compress',
		'GZip', 
		// '--debug',
	] ).catch( ( error: unknown ) => {

		pkgLog.end( )
		throw new BuildError( ERROR_ID.ON_PKG, {
			...data, 
			error,
		} )
	
	} )
	pkgLog.end( )

	if ( type === BUILDER_TYPE.BIN ) return

	// ZIP
	log.debug( 'Creating zips...' )

	console.group( )
	await zipFilesInDirectory(
		projectBuildBin,
		projectBuildZip,
	)
	console.groupEnd( )
	
}

/**
 * Package your cli application for different platforms and architectures.
 *
 * @param   {BuilderParams}     params        - The parameters for creating the binaries.
 * @param   {string}            params.name   - The name of the binary file to be created.
 * @param   {string}            params.outDir - Directory for the output build.
 * @param   {string}            params.input  - The input file for the build process.
 * @param   {'all'|'cjs'|'bin'} params.type   - The build type Result [all|cjs|bin].
 * @param   {string}            params.onlyOs - Build only binary for your current OS.
 * @returns {Promise<void>}                   - A promise that resolves when the binary creation process is complete.
 * @example 
 * import { build } from 'binarium'
 *
 * build({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // outDir: resolve('build'),
 *   // type: 'all',
 * })
 *
 */
export const build = async ( params: BuilderParams ) =>{

	const isDebug = existsFlag( 'debug' ) || BINARIUM_CONSTS?.debug
	const log     = logger( {
		name : BINARIUM_CONSTS?.name || name,
		isDebug,
	} )

	// This is not recomended but is for not display `(node:31972) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.` message.
	// @ts-ignore
	process.noDeprecation = true

	process.on( 'exit', async function ( code ){

		console.log( code )
		if( code !== 130 ) return

		console.groupEnd()
		console.log( '\n' )
		return log.warn( 'Process cancelled 👋' )
	
	} )

	const start = performance.now()
	const stop  = () => log.info( `Total time: ${( ( performance.now() - start ) / 1000 ).toFixed( 2 )} seconds.` )

	try {

		log.info( 'Starting construction...' )
		console.group()
		await buildConstructor( {
			...params,
			log,
		} )
		console.groupEnd()
		log.success( 'Build successful!! ✨' )
	
	}catch( e ){

		console.groupEnd()
		// @ts-ignore
		if( 'name' in e && e.name === 'ExitPromptError' ) return log.warn( 'Process cancelled 👋' )
		if( !( e instanceof BuildError ) ) return log.error( {
			message : 'Unexpected error',
			data    : e,
		} )
		
		if( e.message === ERROR_ID.ON_PKG ) 
			log.error( {
				message : 'Error on PKG',
				// @ts-ignore
				data    : e.data || e,
			} )
		if( e.message === ERROR_ID.ON_NCC ) 
			log.error( {
				message : 'Error on NCC',
				// @ts-ignore
				data    : e.data || e,
			} )
		if( e.message === ERROR_ID.ON_ESBUILD ) 
			log.error( {
				message : 'Error on ESBUILD',
				// @ts-ignore
				data    : e.data || e,
			} )
		if( e.message === ERROR_ID.NO_INPUT ) 
			log.error( {
				message : 'Input is not valid', 
				// @ts-ignore
				data    : e.data,
			} )
		if( e.message === ERROR_ID.PLATFORM_UNKWON ) 
			log.error( {
				message : 'Your platform cannot be detected correctly or is unknown. Try to build without [onlyOS] flag',
				// @ts-ignore
				data    : e.data,
			} )
		if( e.message === ERROR_ID.UNEXPECTED ) 
			log.error( {
				message : 'Unexpected error',
				data    : e,
			} )
		return
	
	}finally{

		stop()
	
	}

}
