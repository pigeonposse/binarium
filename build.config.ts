import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		entries : [
			'./src/main',
			'./src/cli',
			'./src/utils',
		],
		sourcemap   : false,
		declaration : true,
		failOnWarn  : true,
		rollup      : {
			emitCJS : true,
			esbuild : {
				minify : true,
				target : 'node20',
			},
		},
	},
] )
