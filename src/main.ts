/**
 * PACKAGE FILE.
 *
 * @description File with build function.
 */

import { catchError }      from './_shared/error'
import {
	cancel,
	exit,
	onExit,
	setNoDeprecationAlerts,
} from './_shared/process'
import { perf } from './_shared/time'
import { CMDS } from './cmd/main'
import {
	BINARIUM_CONSTS,
	CMD,
	BUILDER_TYPE,
	ERROR_ID,
} from './const'
import * as consts    from './const'
import { BuildError } from './error'
import { getLog }     from './log'

import type {
	BuilderParams,
	Cmd,
	ConfigParams,
} from './types'

export type * from './types'

export {
	BINARIUM_CONSTS,
	BUILDER_TYPE,
	CMD,
	ERROR_ID,
}

const _buildContructor = async ( params: BuilderParams, type?: Cmd ): Promise<void> => {

	const {
		ERROR_ID,
		repositoryURL,
		bugsURL,
		GLOBBAL_OPTIONS,
		OPTIONS,
		CONFIG_EXTS,
		CMD,
	} = consts
	const log = getLog()

	setNoDeprecationAlerts()

	onExit( async code => {

		if ( code !== 130 ) return

		console.log( '\n' )
		console.groupEnd( )
		log.warn( 'Process cancelled 👋\n' )
		exit( 0 )

	} )

	const timeout = perf()

	const opts = {
		...params,
		log,
		consts,
		Error : BuildError,
		catchError,
	}

	const run = async () => {

		const cmds = new CMDS( opts )
		if ( type === consts.CMD.AUTO ) return await cmds.auto( await cmds.getData( ) )
		if ( type === consts.CMD.NODE ) return await cmds.node( await cmds.getData( ) )
		if ( type === consts.CMD.DENO ) return await cmds.deno( await cmds.getData( ) )
		if ( type === consts.CMD.BUN ) return await cmds.bun( await cmds.getData( ) )
		else return await cmds.init( )

	}

	const [ e ] = await catchError( run() )

	if ( e ) {

		console.groupEnd( )
		if ( 'name' in e && e.name === 'ExitPromptError' ) return cancel()

		const errorMessages: { [key: string]: string } = {
			// @ts-ignore
			[ERROR_ID.ON_CONFIG]       : 'Error on config file: ' + e?.data?.error?.message || 'Unexpected error',
			// @ts-ignore
			[ERROR_ID.ON_DENO_COMPILE] : 'Error on Deno compile: ' + e?.data?.error?.message || 'Unexpected error',
			// @ts-ignore
			[ERROR_ID.ON_BUN_COMPILE]  : 'Error on Bun compile: ' + e?.data?.error?.message || 'Unexpected error',
			[ERROR_ID.ON_PKG]          : 'Error on PKG',
			[ERROR_ID.ON_NCC]          : 'Error on NCC',
			[ERROR_ID.ON_ESBUILD]      : 'Error on ESBUILD',
			[ERROR_ID.NO_INPUT]        : `Input is not valid. please add a valid input with --${OPTIONS.INPUT.key} <path>`,
			[ERROR_ID.PLATFORM_UNKWON] : 'Your platform cannot be detected correctly or is unknown',
			[ERROR_ID.ON_COMPRESSION]  : 'Error on Compression',
			[ERROR_ID.PROCESS_NODE]    : `The process must be Node.js.
To create node binaries you need to run [${log.name}] in [${CMD.NODE}] environment`,
			[ERROR_ID.RUNTIME_NODE] : `Runtime [${CMD.NODE}] is not detected.

You must have [${CMD.NODE}] installed.
More info: https://nodejs.org/`,
			[ERROR_ID.RUNTIME_BUN] : `Runtime [${CMD.BUN}] is not detected.

You must have [${CMD.BUN}] installed.
More info: https://bun.sh/`,
			[ERROR_ID.RUNTIME_DENO] : `Runtime [${CMD.DENO}] is not detected.

You must have [${CMD.DENO}] installed.
More info: https://docs.deno.com/`,
			[ERROR_ID.RUNTIME_UNKNOWN] : 'Runtime is unknown or not detected',
		}

		const message = errorMessages[e.message] || 'Unexpected error'
		if ( !log.isDebug ) log.error( `${message}.

DEBUG: 

  Add "--${GLOBBAL_OPTIONS.DEBUG.key}" or "-${GLOBBAL_OPTIONS.DEBUG.alias}" flag to see error details and process data.

HELP: 

  Run:       ${log.name} --${GLOBBAL_OPTIONS.HELP.key}
  See docs:  ${consts.documentationURL}

ADVANCED CONFIGURATION: 

  For a advanced configuration use a configuration file. 

  Example:   ${log.name} --${OPTIONS.CONFIG.key} ./your-config-file.[${Object.values( CONFIG_EXTS ).join( '|' )}]
  See more:  ${repositoryURL}?tab=readme-ov-file#config-file

REPORT: 

  Report an issue: ${bugsURL}
` )
		else log.error( {
			message,
			// @ts-ignore
			data : e.data || e,
		} )

	}
	else {

		console.log()
		log.success( `Build successfully in ${timeout.stop()} seconds. ✨\n` )

	}

}

/**
 * Package your cli application for different platforms and architectures.
 *
 * @param   {BuilderParams} params - The parameters for creating the binaries.
 * @returns {Promise<void>}        - A promise that resolves when the binary creation process is complete.
 * @example
 * import { build } from 'binarium'
 *
 * build({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // output: resolve('build'),
 *   // type: 'all',
 * })
 */
export const build = async ( params: BuilderParams ) => await _buildContructor( params )

/**
 * Package your Node.js cli application for different platforms and architectures.
 *
 * @param   {BuilderParams} params - The parameters for creating the binaries.
 * @returns {Promise<void>}        - A promise that resolves when the binary creation process is complete.
 * @example
 * import { buildNode } from 'binarium'
 *
 * buildNode({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // output: resolve('build'),
 *   // type: 'all',
 * })
 */
export const buildNode = async ( params: BuilderParams ) => await _buildContructor( params, 'node' )

/**
 * Package your Deno cli application for different platforms and architectures.
 *
 * @param   {BuilderParams} params - The parameters for creating the binaries.
 * @returns {Promise<void>}        - A promise that resolves when the binary creation process is complete.
 * @example
 * import { buildDeno } from 'binarium'
 *
 * buildDeno({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // output: resolve('build'),
 *   // type: 'all',
 * })
 */
export const buildDeno = async ( params: BuilderParams ) => await _buildContructor( params, 'deno' )

/**
 * Package your Bun cli application for different platforms and architectures.
 *
 * @param   {BuilderParams} params - The parameters for creating the binaries.
 * @returns {Promise<void>}        - A promise that resolves when the binary creation process is complete.
 * @example
 * import { buildBun } from 'binarium'
 *
 * buildBun({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // output: resolve('build'),
 *   // type: 'all',
 * })
 */
export const buildBun = async ( params: BuilderParams ) => await _buildContructor( params, 'bun' )

/**
 * Package your cli application for different platforms and architectures.
 * Autodectect runtime (node, deno, bun).
 *
 * @param   {BuilderParams} params - The parameters for creating the binaries.
 * @returns {Promise<void>}        - A promise that resolves when the binary creation process is complete.
 * @example
 * import { buildAuto } from 'binarium'
 *
 * buildAuto({
 *   input: 'examples/app',
 *   // name: 'my-app-name',
 *   // output: resolve('build'),
 *   // type: 'all',
 * })
 */
export const buildAuto = async ( params: BuilderParams ) => await _buildContructor( params, 'bun' )

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
 *   nodeOptions: {
 *     esbuild: {
 *        tsconfig: './tsconfig.custom.json'
 *     }
 *   }
 * })
 */
export const defineConfig = ( config: ConfigParams ) => config
