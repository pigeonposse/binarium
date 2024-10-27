
import { joinPath }            from '../../_shared/sys'
import { mergeCustom }         from '../../_shared/vars'
import { buildBinWrappingCmd } from '../_shared/build'
// import { assetsConstructor } from '../_shared/assets'

import type { BuilderContructorParams } from '../../types'

export const buildBins = async ( params: BuilderContructorParams ) => {

	const {
		data,  
		log, 
		catchError,
		consts,
	} = params
	
	const getTargets = ( ) => {

		const {
			onlyOs, 
			platform, 
			arch,
			name,
		} = data

		const denoTargets = {
			[ consts.ARCH.X64 ] : {
				[ consts.PLATFORM.LINUX ] : 'x86_64-unknown-linux-gnu', 
				[ consts.PLATFORM.WIN ]   : 'x86_64-pc-windows-msvc',
				[ consts.PLATFORM.MACOS ] : 'x86_64-apple-darwin',
			},
			[ consts.ARCH.ARM64 ] : {
				[ consts.PLATFORM.LINUX ] : 'aarch64-unknown-linux-gnu', 
				[ consts.PLATFORM.WIN ]   : undefined,
				[ consts.PLATFORM.MACOS ] : 'aarch64-apple-darwin',
			},
		}

		if( onlyOs ) {
			
			return ( arch === consts.ARCH.ARM64
				? [ {
					target : denoTargets[ arch ][ platform ],
					name   : `${name}-${platform}-${arch}`,
				}, {
					target : denoTargets[ consts.ARCH.X64 ][ platform ],
					name   : `${name}-${platform}-${consts.ARCH.X64}`,
				} ]
				: [ {
					target : denoTargets[ arch ][ platform ],
					name   : `${name}-${platform}-${arch}`,
				} ] ).filter( v => v.target !== undefined )
		
		}

		const res = ( Object.entries( denoTargets ).flatMap( ( [ arch, platforms ] ) =>
			Object.entries( platforms ).map( ( [ platform, target ] ) => ( {
				name   : `${name}-${platform}-${arch}`,
				target : target,
			} ) ),
		) ).filter( v => v.target !== undefined )

		return res
	
	}
	
	const run = async () => {

		const targets = getTargets()
		// const assets  = await assetsConstructor( params )

		log.debug( {
			deno : {
				targets, 
				// includes : assets.includes,
			}, 
		} )
		
		for ( let index = 0; index < targets.length; index++ ) {

			const {
				target,
				name: targetName,
			} = targets[ index ]
			
			const defaultConf = [ `-o ${joinPath( data.binDir, targetName )}`, `--target ${target}` ]
			
			// if( assets.includes ) 
			// 	defaultConf.push( assets.includes.map( path => `--include ${path}` ).join( ' ' ) )

			const merge  = mergeCustom<string[]>( {} )
			const config = merge( defaultConf, data.denoOptions?.flags || [] )
		
			config.push( data.input )
			const cmd = `deno compile ${config.join( ' ' )}`

			log.debug( { cmd: cmd } )

			await buildBinWrappingCmd( params, cmd, targetName )
		
		}

		// await assets.rm()
	
	}

	return await catchError( run() )

}
