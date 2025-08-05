/* eslint-disable @stylistic/object-curly-newline */
import { EsbuildConfig } from './esbuild'
import { NccConfig }     from './ncc'
import { PkgConfig }     from './pkg'

export type Config = {
	/**
	 * PKG configuration.
	 *
	 * @see https://www.npmjs.com/package/@yao-pkg/pkg
	 */
	pkg?     : Partial<PkgConfig>
	/**
	 * ESBUILD configuration.
	 *
	 * @see https://esbuild.github.io/api/#build
	 */
	esbuild? : ( EsbuildConfig & {
		/**
		 * Disable esbuild default plugins.
		 *
		 * @default false
		 */
		noDefaultPlugins? : boolean
	} ) | false
	/**
	 * NCC configuration.
	 *
	 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
	 */
	ncc? : NccConfig | false
}
