import {
	build,
	BINARIUM_CONSTS,
} from 'binarium'

BINARIUM_CONSTS.name = 'binarium-lib-test'

await build( {
	input  : 'examples/lib-ts/app',
	name   : BINARIUM_CONSTS.name,
	onlyOs : true,
	type   : 'bin',
} )
