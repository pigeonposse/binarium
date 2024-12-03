
import { resolve } from 'import-meta-resolve'

import {
	readFile,
	pathToFileURL,
	fileURLToPath,
} from '../../../_shared/sys'

import type { Plugin } from 'esbuild'

export default {
	name : 'import.meta.url',
	setup( { onLoad } ) {

		// Help vite that bundles/move files in dev mode without touching `import.meta.url` which breaks asset urls
		onLoad( {
			filter    : /.*\.js/,
			namespace : 'file',
		}, async args => {

			const code                 = await readFile( args.path, 'utf8' )
			const assetImportMetaUrlRE = /\bnew\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*(?:,\s*)?\)/g
			let i                      = 0,
				newCode                = ''
			for ( let match = assetImportMetaUrlRE.exec( code ); match != null; match = assetImportMetaUrlRE.exec( code ) ) {

				newCode       += code.slice( i, match.index )
				const path     = match[1].slice( 1, -1 )
				const resolved = resolve( path, pathToFileURL( args.path ).toString() )
				newCode       += `new URL(${JSON.stringify( fileURLToPath( resolved ) )}, import.meta.url)`
				i              = assetImportMetaUrlRE.lastIndex

			}
			newCode += code.slice( i )
			return { contents: newCode }

		} )

	},
} satisfies Plugin

