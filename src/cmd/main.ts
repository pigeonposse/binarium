import { getData }              from './_shared/data'
import { buildBunConstructor }  from './bun/main'
import { buildDenoConstructor } from './deno/main'
import { buildNodeConstructor } from './node/main'

import type { GetDataParams } from '../types'

type Data = Awaited<ReturnType<typeof getData>>

export class CMDS {

	params

	constructor( params: GetDataParams ) {

		this.params = params
	
	}
	
	async getData(){

		return await getData( this.params )
	
	}

	async node( data: Data ){

		if( !data.systemRuntime.node ) 
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_NODE, data )
		return await buildNodeConstructor( {
			...this.params,
			data : data,
		} )
	
	}

	async deno( data: Data ){

		if( !data.systemRuntime.deno ) 
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_DENO, data )
		return await buildDenoConstructor( {
			...this.params,
			data : data,
		} )
	
	}

	async bun( data: Data ){

		if( !data.systemRuntime.bun ) 
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_BUN, data )
		return await buildBunConstructor( {
			...this.params,
			data : data,
		} )
	
	}

	async auto( data: Data ){

		if( data.processRuntime.node ) return await this.node( data )
		else if( data.processRuntime.deno ) return await this.deno( data )
		else if( data.processRuntime.bun ) return await this.bun( data )
		else throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_UNKNOWN, data )
	
	}

	async init(){

		const data = await getData( this.params )

		if( data.cmd.node ) return await this.node( data )
		else if( data.cmd.deno ) return await this.deno( data )
		else if( data.cmd.bun ) return await this.bun( data )
		else return await this.auto( data )
	
	}

}
