import { build } from 'binarium'
import {
	dirname,
	join,
} from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname( fileURLToPath( import.meta.url ) )

await build( {
	input  : '',
	config : join( __dirname, 'config.js' ),
} )
