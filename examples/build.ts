import {
	build,
	BINARIUM_CONSTS, 
} from 'binarium'

BINARIUM_CONSTS.name = 'binarium-test'

build( {
	input : 'examples/app',
	name  : 'binarium-test',
	// outDir : resolve( 'build' ),
	type  : 'bin',
} )
