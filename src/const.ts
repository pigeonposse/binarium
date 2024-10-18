
import {
	name as pkgName,
	version, 
} from '../package.json'

export const target = 'node20'
export const name = pkgName.toUpperCase()

export { version }

export const ERROR_ID = {
	NO_INPUT        : 'NO_INPUT',
	PLATFORM_UNKWON : 'PLATFORM_UNKWON',
	ON_ESBUILD      : 'ON_ESBUILD',
	ON_COMPRESSION  : 'ON_COMPRESSION',
	ON_NCC          : 'ON_NCC',
	ON_PKG          : 'ON_PKG',
	ON_CONFIG       : 'ON_CONFIG',
	UNEXPECTED      : 'UNEXPECTED',
} as const
export const BUILDER_TYPE = {
	ALL : 'all',
	CJS : 'cjs',
	BIN : 'bin',
} as const

export const ARCH = {
	ARM64 : 'arm64',
	X64   : 'x64',
} as const

export const BINARIUM_CONSTS: { 
	name?: string, 
	debug?: boolean, 
	icon?: string 
	onVersion?: () => void
	onHelp?: () => void
} = {
	icon      : undefined,
	name      : undefined,
	debug     : undefined, 
	onVersion : undefined,
	onHelp    : undefined,
}
