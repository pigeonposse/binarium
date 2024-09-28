import type {
	BUILDER_TYPE, 
	ERROR_ID, 
} from './const'

export type BuilderParams = {
	/**
	 * The app server input file.
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
}

export type BuilderErrors = typeof ERROR_ID[keyof typeof ERROR_ID]
