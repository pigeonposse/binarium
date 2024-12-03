/* eslint-disable jsdoc/check-tag-names */
import type { Config as ConfigBun }  from './bun/types'
import type { Config as ConfigDeno } from './deno/types'
import type { Config as ConfigNode } from './node/types'

export type Config = {
	/**
	 * Custom `node` build configuration.
	 *
	 * Override build options for different build steps.
	 * Use this for advanced use cases.
	 * @experimental
	 */
	nodeOptions? : ConfigNode
	/**
	 * Custom `deno` build configuration.
	 *
	 * Override options for deno executable build.
	 */
	denoOptions? : ConfigDeno
	/**
	 * Custom `bun` build configuration.
	 *
	 * Override options for Bun executable build.
	 */
	bunOptions?  : ConfigBun
}
