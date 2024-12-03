import {
	build,
	BINARIUM_CONSTS,
} from 'binarium'

BINARIUM_CONSTS.name = 'binarium-test'

await build( {
	input  : 'examples/lib/app',
	name   : BINARIUM_CONSTS.name,
	onlyOs : true,
	type   : 'bin',
} )
