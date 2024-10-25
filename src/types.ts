
import type { catchError } from './_shared/error'
import type { Prettify }   from './_shared/types'
import type { getData }    from './cmd/_shared/data'
import type { Config }     from './cmd/types'
import type * as CONSTS    from './const'
import type { BuildError } from './error'
import type { getLog }     from './log'

export type BuilderParams = {
	/**
	 * The app input file.
	 *
	 * The input can be provided without an extension. 
	 * If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`.
	 */
	input: string, 
	/**
	 * Binary name.
	 */
	name?: string,
	/**
	 * Directory for the output build.
	 *
	 * @default './build'
	 */
	outDir?: string, 
	/**
	 * Build only binary for your current OS.
	 *
	 * @default false
	 */
	onlyOs?: boolean
	/**
	 * The build type Result [all|bundle|bin|compress].
	 *
	 * @default 'all'
	 */
	type?: typeof CONSTS.BUILDER_TYPE[keyof typeof CONSTS.BUILDER_TYPE]
	/**
	 * Config file path.
	 * Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml.
	 *
	 * @default undefined
	 */
	config?: string
}

export type BuilderErrors = typeof CONSTS.ERROR_ID[keyof typeof CONSTS.ERROR_ID]

export type ConfigParams = Prettify<Partial<BuilderParams> & Config &{
	/**
	 * Assets for you app.
	 *
	 * @experimental
	 * @example 
	 * { 
	 *   from: 'src/assets', 
	 *   to: 'assets' 
	 * }
	 *
	 */
	assets?: {
		/**
		 * Glob pattern relative to `process.cwd()`.
		 */
		from:string, 
		/**
		 * Dir relative to `${outDir}/cjs`.
		 */
		to:string
	}[],
}>

export type GetDataParams = BuilderParams & {
	log: ReturnType<typeof getLog>
	Error: typeof BuildError
	consts: typeof CONSTS
	catchError: typeof catchError
}

export type BuilderContructorParams = GetDataParams & {
	data: Awaited<ReturnType<typeof getData>>
}
