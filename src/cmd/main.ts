import { getData }              from './_shared/data'
import { printResults }         from './_shared/res'
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

	async getData() {

		return await getData( this.params )

	}

	async node( data: Data ) {

		if ( !data.systemRuntime.node )
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_NODE, data )
		if ( !data.processRuntime.node )
			throw new this.params.Error( this.params.consts.ERROR_ID.PROCESS_NODE, data )

		const opts = {
			...this.params,
			data : data,
		}
		await buildNodeConstructor( opts )
		await printResults( opts )

	}

	async deno( data: Data ) {

		if ( !data.systemRuntime.deno )
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_DENO, data )

		const opts = {
			...this.params,
			data : data,
		}
		await buildDenoConstructor( opts )
		await printResults( opts )

	}

	async bun( data: Data ) {

		if ( !data.systemRuntime.bun )
			throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_BUN, data )

		const opts = {
			...this.params,
			data : data,
		}
		await buildBunConstructor( opts )
		await printResults( opts )

	}

	async auto( data: Data ) {

		if ( data.processRuntime.node ) return await this.node( data )
		else if ( data.processRuntime.deno ) return await this.deno( data )
		else if ( data.processRuntime.bun ) return await this.bun( data )
		else throw new this.params.Error( this.params.consts.ERROR_ID.RUNTIME_UNKNOWN, data )

	}

	async init() {

		const data = await getData( this.params )

		if ( data.cmd.node ) return await this.node( data )
		else if ( data.cmd.deno ) return await this.deno( data )
		else if ( data.cmd.bun ) return await this.bun( data )
		else return await this.auto( data )

	}

}
