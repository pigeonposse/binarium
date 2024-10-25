import { defineConfig } from 'binarium'

export default defineConfig( {
	name       : 'binarium-bun-test',
	input      : 'examples/bun/app',
	onlyOs     : false,
	type       : 'compress',
	bunOptions : { flags: [ '--packages external' ] },
} )
