import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		clean       : true,
		sourcemap   : false,
		declaration : true,
		failOnWarn  : true,
		rollup      : {
			emitCJS : false,
			esbuild : {
				minify : true,
				target : 'node20',
			},
		},
	},
] )
