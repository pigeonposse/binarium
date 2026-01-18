import {
	zipDir,
	zipPaths,
} from './compress'

await zipPaths( {
	input  : [ './*' ],
	output : './build/compress-test',
	opts   : { gitignore: true },
} )
await zipDir( {
	input  : './src',
	output : './build/compress-test-dir',
} )
