import type { BuildOptions } from 'esbuild'

export type Config = {
	/**
	 * PKG configuration.
	 *
	 * @see https://www.npmjs.com/package/@yao-pkg/pkg
	 */
	pkg?: string[]
	/**
	 * ESBUILD configuration.
	 *
	 * @see https://esbuild.github.io/api/#build
	 */
	esbuild?: BuildOptions | false
	/**
	 * NCC configuration.
	 *
	 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
	 */
	ncc?: {
		/**
		 * Provide a custom cache path or disable caching .
		 */
		cache?: string | false;
		/**
		 * Externals to leave as requires of the build.
		 */
		externals?: string[];
		/**
		 * Directory outside of which never to emit assets.
		 */
		filterAssetBase?: string;
		minify?: boolean;
		sourceMap?: boolean;
		assetBuilds?: boolean;
		sourceMapBasePrefix?: string;
		// when outputting a sourcemap, automatically include
		// source-map-support in the output file (increases output by 32kB).
		sourceMapRegister?: boolean;
		watch?: boolean;
		license?: string;
		target?: string;
		v8cache?: boolean;
	} | false
}
