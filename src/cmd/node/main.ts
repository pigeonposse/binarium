
import buildBins    from './bin'
import compile      from './compile'
import buildJS      from './js'
import { joinPath } from '../../_shared/sys'
import { perf }     from '../../_shared/time'
import { compress } from '../_shared/compress'

import type { BuilderContructorParams } from '../../types'

export const buildNodeConstructor = async ( params: BuilderContructorParams ) => {

	const {
		log,
		data,
		consts,
	} = params

	const {
		ERROR_ID,
		BUILDER_TYPE,
		ARCH,
	} = consts

	const {
		platform,
		arch,
	} = data

	const nodeVersion = '20'
	const nodeRange   = `node${nodeVersion}`

	log.info( 'Building node executables...', false )

	// TARGETS
	const getTargets = ( architecture: typeof data.arch ) => ( data.onlyOs
		? [ `${nodeRange}-${platform}-${architecture}` ]
		: [
			`${nodeRange}-alpine-${architecture}`,
			`${nodeRange}-linux-${architecture}`,
			`${nodeRange}-linuxstatic-${architecture}`,
			`${nodeRange}-macos-${architecture}`,
			`${nodeRange}-win-${architecture}`,
		] )

	const targets = arch === ARCH.ARM64
		? [ ...getTargets( ARCH.ARM64 ), ...getTargets( ARCH.X64 ) ]
		: getTargets( ARCH.X64 )

	// ESBUILD
	const esbuildLog = log.group( 'Building js files...' )
	esbuildLog.start()
	const esbuildTime = perf()

	const [ cjsError, cjsInput ] = await buildJS( {
		input         : data.input,
		output        : joinPath( data.jsDir, 'node.cjs' ),
		target        : nodeRange,
		targetVersion : nodeVersion,
		assets        : data.assets,
		// @ts-ignore
		config        : data?.options?.esbuild,
		isDebug       : log.isDebug,
		debug         : log.debug,
	} )

	if ( cjsError ) {

		esbuildLog.end()
		throw new params.Error( ERROR_ID.ON_ESBUILD, {
			...data,
			error : cjsError,
		} )

	}

	console.info( `\nTotal time: ${esbuildTime.stop()} seconds.` )
	esbuildLog.end()

	// ncc
	const nccLog = log.group( 'Converting js file in a single file...\n' )
	nccLog.start()
	const nccTime = perf()

	const [ compileError, compileInput ] = await compile( {
		input   : cjsInput,
		output  : joinPath( data.jsDir, 'index.cjs' ),
		target  : nodeRange,
		// @ts-ignore
		config  : data?.options?.ncc,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if ( compileError ) {

		nccLog.end()
		throw new params.Error( ERROR_ID.ON_NCC, {
			...data,
			error : compileError,
		} )

	}

	console.info( `\nTotal time: ${nccTime.stop()} seconds.` )
	nccLog.end()

	if ( data.type === BUILDER_TYPE.BUNDLE ) return

	// BINS

	const binLog = log.group( 'Creating binaries...\n' )
	binLog.start()
	const binTime = perf()

	const [ binError ] = await buildBins( {
		targets : targets,
		input   : compileInput,
		name    : data.name,
		output  : data.binDir,
		assets  : data.assets,
		// @ts-ignore
		config  : data?.options?.pkg,
		isDebug : log.isDebug,
		debug   : log.debug,
	} )

	if ( binError ) {

		binLog.end( )
		throw new params.Error( ERROR_ID.ON_PKG, {
			...data,
			error : binError,
		} )

	}

	console.info( `\nTotal time: ${binTime.stop()} seconds.` )
	binLog.end( )

	if ( data.type === BUILDER_TYPE.BIN ) return

	// console.info( {
	// 	targets,
	// } )

	// COMPRESS. Not with targets because yao-pkg change the output name of the binaries
	await compress( params  )

}
