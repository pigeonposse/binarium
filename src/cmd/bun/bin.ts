
import { joinPath }            from '../../_shared/sys'
import { mergeCustom }         from '../../_shared/vars'
import { buildBinWrappingCmd } from '../_shared/build'

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

		const bunTargets = {
			[ consts.ARCH.X64 ] : {
				[ consts.PLATFORM.LINUX ] : 'bun-linux-x64', 
				[ consts.PLATFORM.WIN ]   : 'bun-windows-x64',
				[ consts.PLATFORM.MACOS ] : 'bun-darwin-x64',
			},
			[ consts.ARCH.ARM64 ] : {
				[ consts.PLATFORM.LINUX ] : 'bun-linux-arm64', 
				[ consts.PLATFORM.WIN ]   : undefined,
				[ consts.PLATFORM.MACOS ] : 'bun-darwin-arm64',
			},
		}

		if( onlyOs ) {
			
			return ( arch === consts.ARCH.ARM64
				? [ {
					target : bunTargets[ arch ][ platform ],
					name   : `${name}-${platform}-${arch}`,
				}, {
					target : bunTargets[ consts.ARCH.X64 ][ platform ],
					name   : `${name}-${platform}-${consts.ARCH.X64}`,
				} ]
				: [ {
					target : bunTargets[ arch ][ platform ],
					name   : `${name}-${platform}-${arch}`,
				} ] ).filter( v => v.target !== undefined )
		
		}

		const res = ( Object.entries( bunTargets ).flatMap( ( [ arch, platforms ] ) =>
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
			bun : {
				targets, 
				// includes : assets.includes,
			}, 
		} )
		
		for ( let index = 0; index < targets.length; index++ ) {

			const {
				target,
				name: targetName,
			} = targets[ index ]
			
			const defaultConf = [ `--outfile ${joinPath( data.binDir, targetName )}`, `--target ${target}` ]

			const merge  = mergeCustom<string[]>( {} )
			const config = merge( defaultConf, data.denoOptions?.flags || [] )
		
			const cmd = `bun build ${data.input} --compile ${config.join( ' ' )}`

			log.debug( { cmd: cmd } )

			await buildBinWrappingCmd( params, cmd, targetName )
		
		}

		// await assets.rm()
	
	}

	return await catchError( run() )

}
