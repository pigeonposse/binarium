import { defineBuildConfig } from 'unbuild'

console.log( '✨ binarium build config\n\n' )

export default defineBuildConfig( [
	{
		entries     : [ './src/main', './src/cli' ],
		sourcemap   : false,
		declaration : true,
		failOnWarn  : true,
		rollup      : { 
			emitCJS: true,
			esbuild : {
			minify : true,
			target : 'node20',
			
		} },
	},
] )
