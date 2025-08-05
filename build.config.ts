import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		entries : [
			'./src/main',
			'./src/cli',
			'./src/tools',
		],
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
