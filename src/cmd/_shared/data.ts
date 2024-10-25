
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
	noFlags, 
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
	outDir = resolvePath( 'build' ),
	onlyOs = false,
	type,
	log,
	Error: BuildError,
	consts,
}: GetDataParams )=> {

	const {
		ERROR_ID, 
		BUILDER_TYPE,
	} = consts

	type Plat = typeof consts.PLATFORM[keyof typeof consts.PLATFORM] 
	type Arch = typeof consts.ARCH[keyof typeof consts.ARCH]

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
	
	const getConfigfile = async ( path?: string ): Promise<ConfigParams | undefined> => {
	
		try {
	
			if( !path ) return undefined
		
			const exists = await existsPath( path )
			if( !exists ) throw new Error( 'Config file does not exist' )
	
			const config = await readConfigFile( path ) as ConfigParams
		
			return {	
				input       : config?.input || undefined,
				name        : config?.name || undefined,
				outDir      : config?.outDir || undefined,
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
	
		}catch( error ){
	
			throw new BuildError( ERROR_ID.ON_CONFIG, {
				path,
				error, 
			} )
		
		}
	
	}
	
	const version = existsFlag( 'version' ) || existsFlag( 'v' )
	const help    = existsFlag( 'help' ) || existsFlag( 'h' )
	
	if( help || noFlags() ) log.printHelp( )
	if( version ) log.printVersion()

	const params = Object.assign( {}, { 
		input,
		name, 
		outDir,
		onlyOs,
		type, 
		config,
	} )
	
	const flags = {
		input  : getFlagValue( 'input' ) || getFlagValue( 'i' ), 
		outDir : getFlagValue( 'outDir' ) || getFlagValue( 'o' ),
		name   : getFlagValue( 'name' ) || getFlagValue( 'n' ),
		config : getFlagValue( 'config' ) || getFlagValue( 'c' ),
		onlyOs : existsFlag( 'onlyOs' ),
		type   : getFlagValue( 'type' ) as typeof type,
	}
	
	const cmd = {
		node : existsCmd( 'node' ),
		deno : existsCmd( 'deno' ), 
		bun  : existsCmd( 'bun' ),
		auto : !existsCmd( 'node' ) && !existsCmd( 'deno' ) && !existsCmd( 'bun' ),
	}
	
	const existsRT = await existsJSRuntimes()
	
	const systemRuntime  = {
		node : existsRT.includes( 'node' ),
		deno : existsRT.includes( 'deno' ),
		bun  : existsRT.includes( 'bun' ),
	}
	const processRuntime = {
		node : isNode && ( !isDeno || !isBun ),
		deno : isDeno,
		bun  : isBun,
	}

	if( flags.config ) config = flags.config
	const configfile = await getConfigfile( config )

	if( configfile ){

		if( configfile.name ) name = configfile.name
		if( configfile.input ) input = configfile.input
		if( configfile.onlyOs ) onlyOs = configfile.onlyOs
		if( configfile.outDir ) outDir = configfile.outDir
		if( configfile.type && Object.values( BUILDER_TYPE ).includes( configfile.type ) ) type = configfile.type 
	
	}

	if( flags.name ) name = flags.name
	if( flags.input ) input = flags.input
	if( flags.onlyOs ) onlyOs = flags.onlyOs
	if( flags.outDir ) outDir = flags.outDir
	if( flags.type && Object.values( BUILDER_TYPE ).includes( flags.type ) ) type = flags.type 

	log.info( 'Starting construction...' )
	console.log()

	const arch = await getArch()
	const plat = await getPlatform()

	const projectBuild = outDir 
	if( !name ) name = getFilename( input )
		
	const opts = {
		name, 
		input       : resolvePath( input ),
		outDir      : resolvePath( outDir ),
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
	if( !exists ) throw new BuildError( ERROR_ID.NO_INPUT, data )

	// @ts-ignore
	if( data.platform === consts.PLATFORM.UNKNOWN ) throw new BuildError( ERROR_ID.PLATFORM_UNKWON, data )

	return data

}
