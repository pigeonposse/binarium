/* eslint-disable one-var */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { readFile } from '../../../_shared/sys'

import type { Plugin } from 'esbuild'

/**
 * Esbuild plugin used to transform require statements to ES module imports.
 *
 * This plugin is used by the esbuild builder.
 *
 * @returns {Plugin} The esbuild plugin
 * @see https://gist.github.com/hyrious/7120a56c593937457c0811443563e017
 */
export const requireToImportEsbuildPlugin = () => ( {
	name : 'binarium-require-to-import',
	setup( {
		onLoad, esbuild,
	} ) {

		const matchBrace = ( text: any, from: any ) => {

			if ( !( text[from] === '(' ) ) return -1
			let i, k = 1
			for ( i = from + 1; i < text.length && k > 0; ++i ) {

				if ( text[i] === '(' ) k++
				if ( text[i] === ')' ) k--

			}
			const to = i - 1
			if ( !( text[to] === ')' ) || k !== 0 ) return -1
			return to

		}

		const makeName = ( path: string ) => {

			return path.replace( /-(\w)/g, ( _, x ) => x.toUpperCase() )
				.replace( /[^$_a-zA-Z0-9]/g, '_' )

		}

		onLoad( { filter: /\.c?js/ }, async args => {

			let contents = await readFile( args.path, 'utf8' ),
				warnings
			try {

				( { warnings } = await esbuild.transform( contents, {
					format   : 'esm',
					logLevel : 'silent',
				} ) )

			}
			catch ( err ) {

				// @ts-ignore
				( { warnings } = err )

			}
			const lines = contents.split( '\n' )
			// @ts-ignore
			if ( warnings && warnings.some( e => e.text.includes( '"require" to "esm"' ) ) ) {

				let modifications = [], imports = []
				for ( const { location: {
					line, lineText, column, length,
				} } of warnings ) {

					// "require|here|("
					const left = column + length
					// "require('a'|here|)"
					const right = matchBrace( lineText, left )
					if ( right === -1 ) continue
					// "'a'"
					let raw = lineText.slice( left + 1, right ),
						path
					try {

						// 'a'
						path = eval( raw ) // or, write a real js lexer to parse that
						if ( typeof path !== 'string' ) continue // print warnings about dynamic require

					}
					catch ( _e ) {

						continue

					}
					const name = `__import_${makeName( path )}`
					// "import __import_a from 'a'"
					const import_statement = `import ${name} from ${raw};`
					// rewrite "require('a')" -> "__import_a"
					const offset = lines.slice( 0, line - 1 ).map( line => line.length ).reduce( ( a, b ) => a + 1 + b, 0 )
					modifications.push( [
						offset + column,
						offset + right + 1,
						name,
					] )
					imports.push( import_statement )

				}
				if ( imports.length === 0 ) return null
				imports    = [ ...new Set( imports ) ]
				let offset = 0
				for ( const [
					start,
					end,
					name,
				] of modifications ) {

					contents = contents.slice( 0, start + offset ) + name + contents.slice( end + offset )
					offset  += name.length - ( end - start )

				}
				contents = [
					...imports,
					'module.exports',
					contents,
				].join( ';' ) // put imports at the first line, so sourcemaps will be ok
				return { contents }

			}

		} )

	},
} satisfies Plugin )
