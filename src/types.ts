import type {
	BUILDER_TYPE, 
	ERROR_ID, 
} from './const'
import type { Config } from './steps/types'

export type Prettify<T> = {
	[K in keyof T]: Prettify<T[K]>;
} & {}

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
	 * The build type Result [all|cjs|bin].
	 *
	 * @default 'all'
	 */
	type?: typeof BUILDER_TYPE[keyof typeof BUILDER_TYPE]
	/**
	 * Config file path.
	 *
	 * @default undefined
	 */
	config?: string
}

export type BuilderErrors = typeof ERROR_ID[keyof typeof ERROR_ID]

export type ConfigParams = Prettify<Partial<BuilderParams> & {
	/**
	 * Custom build configuration.
	 *
	 * Override build options for different build steps.
	 * Use this for advanced use cases.
	 *
	 * @experimental
	 */
	options?: Config
}>
