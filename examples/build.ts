import { build } from '../dist/main'

build( {
	input : 'examples/app',
	name  : 'binarium-test',
	// outDir : resolve( 'build' ),
	type  : 'bin',
} )
