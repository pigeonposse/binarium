import { Plugin } from 'esbuild'

import { readFile } from '../../../_shared/sys'

export const jsonLoaderEsbuildPlugin = () => ( {
	name : 'binarium-json',
	setup( { onLoad } ) {

		onLoad( { filter: /\.json$/ }, async args => {

			const text = await readFile( args.path, 'utf8' )
			return { contents: `export default ${text}` }

		} )

	},
} satisfies Plugin )
