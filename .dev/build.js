import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [ {
	entries     : [ './src/main', './src/cli' ],
	sourcemap   : false,
	declaration : true,
	rollup      : { esbuild: { minify: true } },
} ] )
