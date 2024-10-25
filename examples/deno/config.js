import { defineConfig } from 'binarium'

export const name = 'binarium-deno-test'

export default defineConfig( {
	name        : name,
	input       : 'examples/deno/app.js',
	onlyOs      : false,
	type        : 'zip',
	denoOptions : { flags: [ '--allow-all', '--no-npm' ] },
} )