import { name as pkgName } from '../package.json'

export const target = 'node20'
export const name = pkgName.toUpperCase()

export const ERROR_ID = {
	NO_INPUT        : 'NO_INPUT',
	PLATFORM_UNKWON : 'PLATFORM_UNKWON',
	ON_ESBUILD      : 'ON_ESBUILD',
	ON_SUCRASE      : 'ON_SUCRASE',
	ON_NCC          : 'ON_NCC',
	ON_PKG          : 'ON_PKG',
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
