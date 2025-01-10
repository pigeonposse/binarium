import { buildBun } from 'binarium'
import {
	dirname,
	join,
} from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname( fileURLToPath( import.meta.url ) )

await buildBun( {
	input  : '',
	config : join( __dirname, 'config.js' ),
} )
