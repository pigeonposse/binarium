/* eslint-disable @stylistic/object-curly-newline */
/* eslint-disable jsdoc/check-tag-names */

import type { catchError } from './_shared/error'
import type { Prettify }   from './_shared/types'
import type { getData }    from './cmd/_shared/data'
import type { Config }     from './cmd/types'
import type * as CONSTS    from './const'
import type { OPTIONS }    from './const'
import type { BuildError } from './error'
import type { getLog }     from './log'

export type Cmd = typeof CONSTS.CMD[keyof typeof CONSTS.CMD]
export type BuilderType = typeof CONSTS.BUILDER_TYPE[keyof typeof CONSTS.BUILDER_TYPE]

export type BuilderParams = {
	/**
	 * The app input file.
	 *
	 * The input can be provided without an extension.
	 * If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`.
	 */
	[OPTIONS.INPUT.key]   : string
	/**
	 * Binary name.
	 */
	[OPTIONS.NAME.key]?   : string
	/**
	 * Directory for the output build.
	 *
	 * @default './build'
	 */
	[OPTIONS.OUTPUT.key]? : string
	/**
	 * Build only binary for your current OS.
	 *
	 * @default false
	 */
	[OPTIONS.ONLYOS.key]? : boolean
	/**
	 * The build type Result.
	 * Supported: "bin", "all", "bundle", "compress"
	 *
	 * @default 'all'
	 */
	[OPTIONS.TYPE.key]?   : BuilderType
	/**
	 * Config file path.
	 * Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml.
	 *
	 * @default undefined
	 */
	[OPTIONS.CONFIG.key]? : string
}

export type BuilderErrors = typeof CONSTS.ERROR_ID[keyof typeof CONSTS.ERROR_ID]

export type ConfigParams = Prettify<Partial<BuilderParams> & Config & {
	/**
	 * Assets for you app.
	 *
	 * @experimental
	 * @example
	 * {
	 *   from: 'src/assets',
	 *   to: 'assets'
	 * }
	 */
	assets?: {
		/**
		 * Glob pattern relative to `process.cwd()`.
		 */
		from : string
		/**
		 * Dir relative to `${output}/cjs`.
		 */
		to   : string
	}[] }>

export type GetDataParams = BuilderParams & {
	log        : ReturnType<typeof getLog>
	Error      : typeof BuildError
	consts     : typeof CONSTS
	catchError : typeof catchError
}

export type BuilderContructorParams = GetDataParams & { data: Awaited<ReturnType<typeof getData>> }
