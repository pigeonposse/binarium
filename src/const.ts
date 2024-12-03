import {
	name as pkgName,
	version,
	bugs,
	repository,
	description,
} from '../package.json'

export const name = pkgName.toUpperCase()
export const bugsURL = bugs.url
export const repositoryURL = repository.url
export const documentationURL = repositoryURL

export {
	version,
	description,
}
export const OPTIONS = {
	INPUT : {
		key   : 'input',
		alias : 'i',
	},
	OUTPUT : {
		key   : 'output',
		alias : 'o',
	},
	NAME : {
		key   : 'name',
		alias : 'n',
	},
	TYPE : {
		key   : 'type',
		alias : 't',
	},
	ONLYOS : {
		key   : 'onlyOs',
		alias : 'O',
	},
	CONFIG : {
		key   : 'config',
		alias : 'c',
	},
} as const

export const GLOBBAL_OPTIONS = {
	VERSION : {
		key   : 'version',
		alias : 'v',
	},
	HELP : {
		key   : 'help',
		alias : 'h',
	},
	DEBUG : {
		key   : 'debug',
		alias : 'd',
	},
} as const

export const CONFIG_EXTS = {
	JSON : 'json',
	YML  : 'yml',
	YAML : 'yaml',
	TOML : 'toml',
	TML  : 'tml',
	MJS  : 'mjs',
	CJS  : 'cjs',
	JS   : 'js',
} as const
export const INPUT_EXTS = {
	TS  : 'ts',
	JS  : 'js',
	MJS : 'mjs',
	MTS : 'mts',
	CJS : 'cjs',
	CTS : 'cts',
}
export const ERROR_ID = {
	NO_INPUT        : 'NO_INPUT',
	PLATFORM_UNKWON : 'PLATFORM_UNKWON',
	ON_DENO_COMPILE : 'ON_DENO_COMPILE',
	ON_BUN_COMPILE  : 'ON_BUN_COMPILE',
	ON_COMPRESSION  : 'ON_COMPRESSION',
	ON_ESBUILD      : 'ON_ESBUILD',
	ON_NCC          : 'ON_NCC',
	ON_PKG          : 'ON_PKG',
	ON_CONFIG       : 'ON_CONFIG',
	RUNTIME_DENO    : 'RUNTIME_DENO',
	RUNTIME_NODE    : 'RUNTIME_NODE',
	RUNTIME_BUN     : 'RUNTIME_BUN',
	RUNTIME_UNKNOWN : 'RUNTIME_UNKNOWN',
	PROCESS_NODE    : 'PROCESS_NODE',
	UNEXPECTED      : 'UNEXPECTED',
} as const
export const BUILDER_TYPE = {
	ALL      : 'all',
	BUNDLE   : 'bundle',
	BIN      : 'bin',
	COMPRESS : 'compress',
} as const

export const CMD = {
	AUTO : 'auto',
	NODE : 'node',
	DENO : 'deno',
	BUN  : 'bun',
} as const

export const ARCH = {
	ARM64 : 'arm64',
	X64   : 'x64',
} as const

export const PLATFORM = {
	WIN     : 'win',
	LINUX   : 'linux',
	MACOS   : 'macos',
	UNKNOWN : 'unknown',
} as const

export const BINARIUM_CONSTS: {
	name?      : string
	desc?      : string
	docsURL?   : string
	debug?     : boolean
	icon?      : string
	onVersion? : () => void
	onHelp?    : () => void
} = {
	icon      : undefined,
	desc      : undefined,
	name      : undefined,
	docsURL   : undefined,
	debug     : undefined,
	onVersion : undefined,
	onHelp    : undefined,
}
