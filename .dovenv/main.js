import { defineConfig } from '@dovenv/core'
import {
	geMDTocString,
	joinPath,
	writeFile,
	joinUrl,
} from '@dovenv/core/utils'
import pigeonposseTheme, {
	convert,
	examples,
	partial,
	template,
	templates,
} from '@dovenv/theme-pigeonposse'

import core from './const.js'

const sidebar = [
	{
		text  : 'Introduction',
		items : [
			{
				text : `What is ${core.pkg.name.toUpperCase()}?`,
				link : '/guide/',
			},
		],
	},
	{
		text  : 'Reference',
		items : [
			{
				text  : `📚 Library / CLI`,
				items : [
					{
						text : `🏁 Get started`,
						link : '/guide/core/',
					},
					{
						text : `📈 Usage`,
						link : '/guide/core/usage.md',
					},
					{
						text : `⚙️ Options`,
						link : '/guide/core/options.md',
					},
					{
						text : `📖 Api`,
						link : '/guide/core/api.md',
					},
					{
						text : `💡 Examples`,
						link : '/guide/core/examples.md',
					},
				],
			},
			{
				text : '🤖 Github Action',
				link : '/guide/action/',
			},
		],
	},
]

export default defineConfig(
	pigeonposseTheme( {
		core,
		docs : {
			input     : 'docs',
			output    : 'build',
			vitepress : {
				ignoreDeadLinks : true,
				themeConfig     : { outline: { level: [ 2, 3 ] } },
				vite            : { build: { chunkSizeWarningLimit: 1000 } },
			},
			navLinks : [
				{
					icon : 'githubactions',
					link : core.pkg.extra.githubactionUrl,
				},
			],
			styles : { color : { dark : {
				bg      : '#070d0e',
				bgAlt   : '#080e0f',
				bgSoft  : '#080e0f',
				divider : '#a7ebff1a',
			} } },
			sidebar : {
				'/guide/'       : sidebar,
				'/todo/'        : sidebar,
				'/contributors' : sidebar,
			},
			autoSidebar : {
				intro     : false,
				reference : false,
			},
			pwa : { manifest : {  icons : [
				{
					src   : 'pwa-64x64.png',
					sizes : '64x64',
					type  : 'image/png',
				},
				{
					src   : 'pwa-192x192.png',
					sizes : '192x192',
					type  : 'image/png',
				},
				{
					src   : 'pwa-512x512.png',
					sizes : '512x512',
					type  : 'image/png',
				},
				{
					src     : 'maskable-icon-512x512.png',
					sizes   : '512x512',
					type    : 'image/png',
					purpose : 'maskable',
				},
			] } },
		},
		repo : { commit : { scopes : [
			{ value: 'core' },
			{ value: 'env' },
			{ value: 'all' },
		] } },
		lint : { staged: { '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json}': 'dovenv lint eslint --fix' } },
	} ),
	{ custom : { predocs : {
		desc : 'Custom predocs',
		fn   : async ( { utils } ) => {

			const config           = utils.config
			const wsDir            = config.const.wsDir
			const pkg              = config.const.pkg
			const name             = pkg.extra.productName || pkg.name
			const examplesInstance = new examples.Examples( { utils } )
			const convertInstance  = new convert.Convert( { utils } )

			const content = await convertInstance.ts2md( {
				input : [ 'src/main.ts' ],
				opts  : {
					tsconfigPath    : joinPath( wsDir, 'tsconfig.json' ),
					packageJsonPath : joinPath( wsDir, 'package.json' ),
					typedoc         : { logLevel: 'Error' },
					typedocMarkdown : {
						hidePageHeader : true,
						hidePageTitle  : true,
					},
				},
			} )

			const apiContent = content[0].content
				.replaceAll( '](index.md#', '](#' ) // this is because typedoc adds index.md# to the links

			await writeFile( joinPath( wsDir, 'docs/guide/core/api.md' ), `# \`${name}\` - API documentation\n\n` + apiContent )

			const examplesContent = await examplesInstance.fromConfig( {
				input : joinPath( wsDir, 'examples/info.yml' ),
				title : 'Examples',
				desc  : `All these examples can be found [here](${pkg.repository.url.replace( '.git', '' ).replace( 'git+', '' )}/tree/main/examples)`,
			} )

			await writeFile(
				joinPath( wsDir, 'docs/guide/core/examples.md' ),
				examplesContent
					.split( '\n' )
					.map( line => {

						if (
							line.startsWith( '```ts' )
							|| line.startsWith( '```ts ' )
						) return line.replace( /(\bts\b|\bts )/g, '$1 twoslash' )
						else if (
							line.startsWith( '```js' )
							|| line.startsWith( '```js ' )
						) return line.replace( /(\bjs\b|\bjs )/g, '$1 twoslash' )
						return line

					} )
					.join( '\n' ),
			)
			const tempKey  = 'readme'
			const tempOpts = { [tempKey] : {
				input : template.readmePkg,
				const : {
					libPkg : core.pkg,
					desc   : core.pkg.description,
					title  : core.pkg.extra.productName,
					banner : '![BANNER](docs/public/banner.png)',
				},
				partial : {
					installation : { input: partial.installation },
					footer       : { input: partial.footer },
					precontent   : { input: '' },
					content      : { input : `## 🌟 Features
			
- ⚡ **Fast**: Optimized for quick execution and minimal overhead.
- 🚀 **Easy to Use**: Simple setup with minimal configuration required.
- 🛠️ **Advanced Configuration**: Customize to fit your project's exact needs.
- 🌍 **Available for**:
	- 🟢 **Node.js**
	- 🦕 **Deno**
	- 🍞 **Bun**
- 🌐 **Supports Multiple Environments**:
	- 📦 **JavaScript Library**: Integrates seamlessly into any project.
	- 💻 **Command Line Interface (CLI)**: Works across Node.js, Deno, and Bun environments.
	- 🤖 **GitHub Action**: Easily incorporate it into CI/CD pipelines with GitHub Actions support.

## 📚 Documentation

- [Get started](${core.pkg.homepage})
- [Api Documentation](${joinUrl( core.pkg.homepage, 'guide/core/api' )})

## 🤖 GitHub Action

You can use Binarium as a GitHub action.
			
- [Read more](${core.pkg.extra.githubactionUrl})
			
` },
				},
				hook : { afterPartials : async data => {

					data.const.toc = `## 📌 Index\n\n` + await geMDTocString( {
						input    : data.content,
						removeH1 : true,
					} )
					return data

				} },
				output : joinPath( core.workspaceDir, 'README.md' ),
			} }
			const tempInstance = new templates.Templates( {
				opts : tempOpts,
				utils,
			} )

			await tempInstance.run( [ tempKey ] )

		},
	} } },
)
