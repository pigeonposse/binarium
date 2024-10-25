import { defineConfig } from 'binarium'

export const name = 'binarium-complex-test'
export default defineConfig( {
	input  : '../Documents/pigeonposse/env-ai/src/bin.ts',
	name,
	onlyOs : true,
	type   : 'bin',
	// assets : [ {
	// 	from : '../Documents/pigeonposse/env-ai/node_modules/llamaindex/**',
	// 	to   : 'node_modules/llamaindex', 
	// } ],

} )
