import { defineConfig } from 'binarium'

export const name = 'binarium-assets-ts-test'
export default defineConfig( {
	input  : 'examples/assets-ts/app.ts',
	onlyOs : true,
	name,
	type   : 'bin',
	assets : [ {
		from : 'examples/assets-ts/public/**',
		to   : 'public', 
	} ],
} )
