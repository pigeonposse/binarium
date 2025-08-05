import { zipPaths } from './compress'

await zipPaths( {
	input  : [ './*' ],
	output : './build/compress-test',
	opts   : { gitignore: true },
} )
