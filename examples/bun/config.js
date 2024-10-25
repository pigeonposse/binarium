import { defineConfig } from 'binarium'

export default defineConfig( {
	name       : 'binarium-bun-test',
	input      : 'examples/bun/app',
	onlyOs     : false,
	type       : 'zip',
	bunOptions : { flags: [ '--packages external' ] },
} )
