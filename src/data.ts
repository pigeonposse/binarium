import {
	existsFlag,
	getFlagValue, 
} from './_shared/process'
import {
	existsPath,
	getArch, 
	getFilename, 
	getPlatform, 
	joinPath,
	readConfigFile,
	resolvePath,
} from './_shared/sys'
import {
	ERROR_ID, 
	target, 
	BUILDER_TYPE,
	ARCH,
} from './const'
import { BuildError } from './error'

import type { getLog } from './log'
import type {
	BuilderParams,
	ConfigParams, 
} from './types'

type BuildConstructorParams = BuilderParams & { log: ReturnType<typeof getLog> }

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
			input   : config?.input || undefined,
			name    : config?.name || undefined,
			outDir  : config?.outDir || undefined,
			onlyOs  : config?.onlyOs || undefined,
			type    : ( config?.type && Object.values( BUILDER_TYPE ).includes( config.type ) ) ? config.type : undefined,
			options : {
				esbuild : config?.options?.esbuild || undefined,
				ncc     : config?.options?.ncc || undefined, 
				pkg     : config?.options?.pkg || undefined,
			},
		}

	}catch( error ){

		throw new BuildError( ERROR_ID.ON_CONFIG, {
			path,
			error, 
		} )
	
	}

}
export const getData = async ( { 
	input,
	name, 
	config,
	outDir = resolvePath( 'build' ),
	onlyOs = false,
	type = BUILDER_TYPE.ALL, 
	log,
}: BuildConstructorParams )=> {

	const version = existsFlag( 'version' )
	const help    = existsFlag( 'help' )

	if( help ) log.printHelp( )
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
		input  : getFlagValue( 'input' ), 
		onlyOs : existsFlag( 'onlyOs' ),
		outDir : getFlagValue( 'outDir' ),
		type   : getFlagValue( 'type' ) as typeof type,
		name   : getFlagValue( 'name' ),
		config : getFlagValue( 'config' ),
	}
	
	if( flags.config ) config = flags.config
	const configfile = await getConfigfile( config )

	if( configfile ){

		if( configfile.name ) name = configfile.name
		if( configfile.input ) input = configfile.input
		if( configfile.onlyOs ) onlyOs = configfile.onlyOs
		if( configfile.outDir ) outDir = configfile.outDir
	
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
		input   : resolvePath( input ),
		name, 
		outDir  : resolvePath( outDir ),
		onlyOs,
		type, 
		options : configfile?.options,
	}

	const data = {
		platform : plat,
		arch,
		opts,
	}

	const projectBuildBin = joinPath( projectBuild, 'bin' )
	const projectBuildZip = joinPath( projectBuild, 'zip' )
	const projectBuildCjs = joinPath( projectBuild, 'cjs' )

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
			configfile,
			...data, 
			targets,
		},
	}, null, 2 ) )

	// EXIST INPUT

	const exists = await getInput( input )
	if( !exists ) throw new BuildError( ERROR_ID.NO_INPUT, data )
	else input = exists

	if( plat === 'unknown' ) throw new BuildError( ERROR_ID.PLATFORM_UNKWON, data )

	return {
		...data.opts,
		targets,
		binDir      : projectBuildBin,
		jsDir       : projectBuildCjs,
		compressDir : projectBuildZip,
	}

}
