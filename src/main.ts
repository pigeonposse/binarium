/**
 * PACKAGE FILE.
 *
 * @description File with build function.
 */
import { catchError }      from './_shared/error'
import {
	exit,
	onExit,
	setNoDeprecationAlerts,
} from './_shared/process'
import { joinPath } from './_shared/sys'
import { perf }     from './_shared/time'
import {
	ERROR_ID, 
	target, 
	BUILDER_TYPE,
	BINARIUM_CONSTS,
} from './const'
import { getData }    from './data'
import { BuildError } from './error'
import { getLog }     from './log'
import buildBins      from './steps/bin'
import buildCjs       from './steps/cjs'
import compile        from './steps/compile'
import compress       from './steps/compress'

import type {
	BuilderParams,
	ConfigParams, 
} from './types'

export type * from './types'

export { BINARIUM_CONSTS }

export const buildConstructor = async ( params: Parameters<typeof getData>[0] ) => {
	
	const { log } = params
	const data    = await getData( params )

	const projectBuildCjsFile   = joinPath( data.jsDir, 'node.cjs' )
	const projectBuildIndexFile = joinPath( data.jsDir, 'index.cjs' )
		
	// ESBUILD
	const esbuildLog = log.group( 'Building cjs files...' )
	esbuildLog.start()
	const esbuildTime = perf()

	const cjs = await buildCjs( {
		input   : data.input,
		output  : projectBuildCjsFile,
		target  : target,
		// @ts-ignore
		config  : data?.options?.esbuild,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if( cjs ) {

		const [ cjsError ] = cjs
		if( cjsError ) {

			esbuildLog.end()
			throw new BuildError( ERROR_ID.ON_ESBUILD, {
				...data, 
				error : cjsError,
			} )
		
		}
		
	}

	console.info( `\nTotal time: ${esbuildTime.stop()} seconds.` )
	esbuildLog.end()

	// ncc
	const nccLog = log.group( 'Converting cjs file in a single file...' )
	nccLog.start()
	const nccTime = perf()
	
	const compileRes = await compile( {
		input   : projectBuildCjsFile,
		output  : projectBuildIndexFile,
		// @ts-ignore
		config  : data?.options?.ncc,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if( compileRes ){

		const [ compileError ] = compileRes
		if( compileError ) {

			nccLog.end()
			throw new BuildError( ERROR_ID.ON_NCC, {
				...data, 
				error : compileError,
			} )
		
		}
	
	}

	console.info( `\nTotal time: ${nccTime.stop()} seconds.` )
	nccLog.end()

	if ( data.type === BUILDER_TYPE.CJS ) return
	
	// BINS
	
	const binLog = log.group( 'Creating binaries...' )
	binLog.start()
	const binTime = perf()
	
	const bin = await buildBins( {
		targets : data.targets,
		input   : projectBuildIndexFile,
		name    : data.name,
		output  : data.binDir,
		// @ts-ignore
		config  : data?.options?.pkg,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if( bin ) {

		const [ binError ] = bin
		if( binError ) {

			binLog.end( )
			throw new BuildError( ERROR_ID.ON_PKG, {
				...data, 
				error : binError,
			} )
		
		}
	
	}

	console.info( `\nTotal time: ${binTime.stop()} seconds.` )
	binLog.end( )

	if ( data.type === BUILDER_TYPE.BIN ) return

	// COMPRESS
	const compressLog = log.group( 'Compressing binaries...' )
	compressLog.start()
	const compressTime  = perf()
	const [ compError ] = await compress( {
		input   : data.binDir,
		output  : data.compressDir,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if( compError ) {

		compressLog.end()
		throw new BuildError( ERROR_ID.ON_COMPRESSION, {
			...data, 
			error : compError,
		} )
	
	}

	console.info( `\nTotal time: ${compressTime.stop()} seconds.` )
	compressLog.end()

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

	const log = getLog()

	setNoDeprecationAlerts()

	onExit( async code => {

		if( code !== 130 ) return

		console.log( '\n' )
		console.groupEnd( )
		log.warn( 'Process cancelled 👋\n' )
		exit( 0 )
	
	} )

	const timeout = perf()

	const [ e ] = await catchError( buildConstructor( {
		...params,
		log,
	} ) )

	if( e ) {

		console.groupEnd( )
		if( 'name' in e && e.name === 'ExitPromptError' ) return exit( 130 )
			
		const errorMessages: { [key: string]: string } = {
			// @ts-ignore
			[ ERROR_ID.ON_CONFIG ]       : 'Error on config file: ' + e?.data?.error?.message || 'Unexpected error',
			[ ERROR_ID.ON_PKG ]          : 'Error on PKG',
			[ ERROR_ID.ON_NCC ]          : 'Error on NCC',
			[ ERROR_ID.ON_ESBUILD ]      : 'Error on ESBUILD',
			[ ERROR_ID.NO_INPUT ]        : 'Input is not valid',
			[ ERROR_ID.PLATFORM_UNKWON ] : 'Your platform cannot be detected correctly or is unknown. Try to build without [onlyOS] flag',
			[ ERROR_ID.ON_COMPRESSION ]  : 'Error on Compression',
		}
			
		const message = errorMessages[ e.message ] || 'Unexpected error'
		if( !log.isDebug ) log.error( `${message}.\n\nAdd "--debug" flag to see error details.\n` )
		else log.error( {
			message,
			// @ts-ignore
			data : e.data || e,
		} )
			
	}else {

		console.log()
		log.success( `Build successfully in ${timeout.stop()} seconds. ✨\n` )
	
	}

}

/**
 * Define the configuration for the binary builder.
 *
 * @param   {ConfigParams} config - The configuration object.
 * @returns {ConfigParams}        - The configuration object.
 * @example
 * import { defineConfig } from 'binarium'
 *
 * export default defineConfig({
 *   name: 'my-app-name',
 *   onlyOs: true,
 *   options: {
 *     esbuild: {
 *        tsconfig: './tsconfig.custom.json'
 *     }
 *   }
 * })
 *
 */
export const defineConfig = ( config: ConfigParams ) => config
