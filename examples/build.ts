import { name }  from './app'
import { build } from '../dist/main'

build( {
	input : 'examples/app',
	name  : name,
	// outDir : resolve( 'build' ),
	type  : 'bin',
} )
