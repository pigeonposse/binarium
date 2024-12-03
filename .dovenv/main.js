import { defineConfig }         from '@dovenv/core'
import { config as bandaTheme } from '@dovenv/theme-banda'
import {
	asciiFont,
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
} from '@dovenv/utils'

const workspaceDir = joinPath( getCurrentDir( import.meta.url ), '..' )
const pkgPath      = joinPath( workspaceDir, 'package.json' )
const pkg          = await getObjectFromJSONFile( pkgPath )

export default defineConfig(
	{
		name  : 'BINARIUM DEV UTILS',
		desc  : 'Workspace tools for BINARIUM',
		const : {
			workspaceDir,
			pkg,
			mark : `\n${asciiFont( `pigeonposse\n-------\n${pkg.extra.id}`, 'ANSI Shadow' )}\nAuthor: ${pkg.author.name}\n`,
		},
	},
	bandaTheme( {
		// TODO: make documentation page
		docs : {
			in  : 'docs',
			out : 'build/docs',
		},
		repo : { commit : { scopes : [
			{ value: 'core' },
			{ value: 'env' },
			{ value: 'all' },
		] } },
		lint : {
			staged : { '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json}': 'eslint' },
			eslint : { flags: [ '--fix' ] },
		},
		// 'repo': {
		// 	''
		// },
		workspace : { check : { pkg : { schema : async ( {
			v, path, data,
		} ) => {

			if ( !data ) throw new Error( `No data in ${path}` )
			if ( 'private' in data ) return
			return v.object( {
				name        : v.string(),
				version     : v.string(),
				description : v.string(),
			} )

		} } } },
	} ),
)
