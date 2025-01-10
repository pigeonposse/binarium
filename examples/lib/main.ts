import { build } from 'binarium'
import { join }  from 'node:path'

await build( {
	input  : join( import.meta.dirname, 'app' ),
	name   : 'binarium-test',
	onlyOs : true,
	type   : 'bin',
} )
