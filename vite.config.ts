/**
 * Vite config.
 *
 * @description Vite config.
 * @see https://vitejs.dev/guide
 */
import { defineConfig } from 'vite'
import dts              from 'vite-plugin-dts'

const target = 'node20'
export const port = 13126

export default defineConfig( {
	esbuild : { 
		platform : 'node',
		target,
	},
	server : {
		host : '0.0.0.0', 
		port,
	},
	preview : { port },
	build   : {
		ssr : true,
		target,
		lib : {
			entry   : [ 'src/main.ts', 'src/bin.ts' ],  
			formats : [ 'es' ],
		},
	},
	plugins : [ dts( { rollupTypes: true } ) ],
} )
