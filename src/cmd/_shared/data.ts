
import {
	isBun,
	isDeno,
	isNode,
} from '../../_shared/env'
import {
	existsCmd,
	existsFlag,
	existsJSRuntimes,
	getFlagValue,
} from '../../_shared/process'
import {
	existsPath,
	getArch,
	getFilename,
	getPlatform,
	joinPath,
	readConfigFile,
	resolvePath,
} from '../../_shared/sys'

import type {
	ConfigParams,
	GetDataParams,
} from '../../types'

export const getData = async ( {
	input,
	name,
	config,
	output = resolvePath( 'build' ),
	onlyOs = false,
	type,
	log,
	Error: BuildError,
	consts,
}: GetDataParams ) => {

	const {
		ERROR_ID,
		BUILDER_TYPE,
		GLOBBAL_OPTIONS,
		OPTIONS,
		CMD,
	} = consts

	type Plat = typeof consts.PLATFORM[keyof typeof consts.PLATFORM]
	type Arch = typeof consts.ARCH[keyof typeof consts.ARCH]

	const getInput = async ( path: string ) => {

		const validExtensions = Object.values( consts.INPUT_EXTS ).map( ext => `.${ext}` )

		if ( !validExtensions.some( ext => path.endsWith( ext ) ) ) {

			for ( let index = 0; index < validExtensions.length; index++ ) {

				const input = path + validExtensions[index]

				const exists = await existsPath( input )
				if ( exists ) return input

			}
			return undefined

		}

		const exists = await existsPath( path )
		if ( exists ) return path
		return undefined

	}

	const getConfigfile = async ( path?: string ): Promise<ConfigParams | undefined> => {

		try {

			if ( !path ) return undefined

			const exists = await existsPath( path )
			if ( !exists ) throw new Error( 'Config file does not exist' )

			const config = await readConfigFile( path ) as ConfigParams

			return {
				input       : config?.input || undefined,
				name        : config?.name || undefined,
				output      : config?.output || undefined,
				onlyOs      : config?.onlyOs || undefined,
				type        : ( config?.type && Object.values( BUILDER_TYPE ).includes( config.type ) ) ? config.type : undefined,
				assets      : config?.assets || undefined,
				nodeOptions : {
					esbuild : config?.nodeOptions?.esbuild !== undefined ? config.nodeOptions.esbuild : undefined,
					pkg     : config?.nodeOptions?.pkg !== undefined ? config.nodeOptions.pkg : undefined,
					ncc     : config?.nodeOptions?.ncc !== undefined ? config.nodeOptions.ncc : undefined,
				},
				bunOptions  : config?.bunOptions || undefined,
				denoOptions : config?.denoOptions || undefined,
			}

		}
		catch ( error ) {

			throw new BuildError( ERROR_ID.ON_CONFIG, {
				path,
				error,
			} )

		}

	}

	const version = existsFlag( GLOBBAL_OPTIONS.VERSION.key ) || existsFlag( GLOBBAL_OPTIONS.VERSION.alias )
	const help    = existsFlag( GLOBBAL_OPTIONS.HELP.key ) || existsFlag( GLOBBAL_OPTIONS.HELP.alias )

	if ( help ) log.printHelp( )
	if ( version ) log.printVersion()

	const params = Object.assign( {}, {
		input,
		name,
		output,
		onlyOs,
		type,
		config,
	} )

	const flags = {
		input  : getFlagValue( OPTIONS.INPUT.key ) || getFlagValue( OPTIONS.INPUT.alias ),
		output : getFlagValue( OPTIONS.OUTPUT.key ) || getFlagValue( OPTIONS.OUTPUT.alias ),
		name   : getFlagValue( OPTIONS.NAME.key ) || getFlagValue( OPTIONS.NAME.alias ),
		config : getFlagValue( OPTIONS.CONFIG.key ) || getFlagValue( OPTIONS.CONFIG.alias ),
		onlyOs : existsFlag( OPTIONS.ONLYOS.key ) || existsFlag( OPTIONS.ONLYOS.alias ),
		type   : getFlagValue( OPTIONS.TYPE.key ) as typeof type || getFlagValue( OPTIONS.TYPE.alias ) as typeof type,
	}

	const cmd = {
		node : existsCmd( CMD.NODE ),
		deno : existsCmd( CMD.DENO ),
		bun  : existsCmd( CMD.BUN ),
		auto : !existsCmd( CMD.NODE ) && !existsCmd( CMD.DENO ) && !existsCmd( CMD.BUN ),
	}

	const existsRT = await existsJSRuntimes()

	const systemRuntime = {
		node : existsRT.includes( CMD.NODE ),
		deno : existsRT.includes( CMD.DENO ),
		bun  : existsRT.includes( CMD.BUN ),
	}

	const processRuntime = {
		node : ( isDeno || isBun ) ? false : isNode,
		deno : isDeno,
		bun  : isBun,
	}

	if ( processRuntime.bun ) log.debug( 'Bun must be equal or greater than 1.1.7 version. Because compression could not work. see: https://github.com/oven-sh/bun/issues/6992' )

	if ( flags.config ) config = flags.config
	const configfile = await getConfigfile( config )

	if ( configfile ) {

		if ( configfile.name ) name = configfile.name
		if ( configfile.input ) input = configfile.input
		if ( configfile.onlyOs ) onlyOs = configfile.onlyOs
		if ( configfile.output ) output = configfile.output
		if ( configfile.type && Object.values( BUILDER_TYPE ).includes( configfile.type ) ) type = configfile.type

	}

	if ( flags.name ) name = flags.name
	if ( flags.input ) input = flags.input
	if ( flags.onlyOs ) onlyOs = flags.onlyOs
	if ( flags.output ) output = flags.output
	if ( flags.type && Object.values( BUILDER_TYPE ).includes( flags.type ) ) type = flags.type

	log.info( 'Starting construction...' )
	console.log()

	const arch = await getArch()
	const plat = await getPlatform()

	const projectBuild = output
	if ( !name ) name = getFilename( input )

	const opts = {
		name,
		input       : resolvePath( input ),
		output      : resolvePath( output ),
		onlyOs,
		type        : type || BUILDER_TYPE.ALL,
		nodeOptions : configfile?.nodeOptions,
		bunOptions  : configfile?.bunOptions,
		denoOptions : configfile?.denoOptions,
		assets      : configfile?.assets,
	}

	const projectBuildBin = joinPath( projectBuild, BUILDER_TYPE.BIN )
	const projectBuildZip = joinPath( projectBuild, BUILDER_TYPE.COMPRESS )
	const projectBuildCjs = joinPath( projectBuild, BUILDER_TYPE.BUNDLE )

	const moreOpts = {
		platform    : plat as Exclude<Plat, 'unknown'>,
		arch        : arch as Arch,
		cmd,
		systemRuntime,
		processRuntime,
		binDir      : projectBuildBin,
		jsDir       : projectBuildCjs,
		compressDir : projectBuildZip,
	}

	log.debug( {
		message : 'Init data: function params, process flags, configFile options, final options..',
		data    : {
			fnParams : params,
			cliFlags : flags,
			configfile,
			opts,
			...moreOpts,
		},
	} )

	const data = {
		...opts,
		...moreOpts,
	}

	// EXISTs INPUT
	const exists = await getInput( data.input )
	if ( !exists ) throw new BuildError( ERROR_ID.NO_INPUT, data )

	// @ts-ignore
	if ( data.platform === consts.PLATFORM.UNKNOWN ) throw new BuildError( ERROR_ID.PLATFORM_UNKWON, data )

	return data

}
