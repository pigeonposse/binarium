import type { BuildOptions } from 'esbuild'

export type Config = {
	/**
	 * PKG configuration.
	 * @see https://www.npmjs.com/package/@yao-pkg/pkg
	 */
	pkg?: {
		/**
		 * Input of the js code.
		 */
		input?    : string
		/**
		 * Binary name.
		 * This overrirides the default name.
		 */
		name?     : string
		/**
		 * Output for the binaries.
		 * This overrirides the default output path.
		 */
		output?   : string
		/**
		 * Targets of your binary.
		 * Must be a list of strings in the following format:
		 * {nodeRange}-{platform}-[arch].
		 * @see https://github.com/yao-pkg/pkg?tab=readme-ov-file#targets
		 * @example [ 'node18-macos-x64', 'node14-linux-arm64']
		 */
		targets?  : string[]
		/**
		 * Assets is a glob or list of globs.
		 * Files specified as assets will be packaged into executable as raw content without modifications.
		 * Javascript files may also be specified as assets. Their sources will not be stripped as it improves execution performance of the files and simplifies debugging.
		 * Relative to input. Default input: build/cjs.
		 * @see https://github.com/yao-pkg/pkg?tab=readme-ov-file#assets
		 */
		assets?   : string | string[]
		/**
		 * Scripts is a glob or list of globs.
		 * Files specified as scripts will be compiled using v8::ScriptCompiler and placed into executable without sources.
		 * They must conform to the JS standards of those Node.js versions you target.
		 * Relative to input. Default input: build/cjs.
		 * @see https://github.com/yao-pkg/pkg?tab=readme-ov-file#scripts
		 */
		scripts?  : string | string[]
		/**
		 * Ignore is a list of globs. Files matching the paths specified as ignore will be excluded from the final executable.
		 * This is useful when you want to exclude some files from the final executable, like tests, documentation or build files that could have been included by a dependency.
		 * @see https://github.com/yao-pkg/pkg?tab=readme-ov-file#ignore-files
		 */
		ignore?   : string[]
		/**
		 * Pass --compress Brotli or --compress GZip to pkg to compress further the content of the files store in the exectable.
		 * This option can reduce the size of the embedded file system by up to 60%.
		 * The startup time of the application might be reduced slightly.
		 */
		compress? : 'Gzip' | 'Brotli'
		/**
		 * Custom flags for the pkg command.
		 * @see https://github.com/yao-pkg/pkg?tab=readme-ov-file#usage
		 */
		flags?    : string[]
	}
	/**
	 * ESBUILD configuration.
	 * @see https://esbuild.github.io/api/#build
	 */
	esbuild? : BuildOptions | false
	/**
	 * NCC configuration.
	 * @see https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs
	 */
	ncc?: {
		/**
		 * Provide a custom cache path or disable caching .
		 */
		cache?               : string | false
		/**
		 * Externals to leave as requires of the build.
		 */
		externals?           : string[]
		/**
		 * Directory outside of which never to emit assets.
		 */
		filterAssetBase?     : string
		minify?              : boolean
		sourceMap?           : boolean
		assetBuilds?         : boolean
		sourceMapBasePrefix? : string
		// when outputting a sourcemap, automatically include
		// source-map-support in the output file (increases output by 32kB).
		sourceMapRegister?   : boolean
		watch?               : boolean
		license?             : string
		target?              : string
		v8cache?             : boolean
	} | false
}
