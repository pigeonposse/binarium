# Examples

All these examples can be found [here](https://github.com/pigeonposse/binarium/tree/main/examples)

## CLI example

Create a TypeScript app and build the executables with `binarium`

### App file

This file is found in "cli/app.ts"

```ts twoslash
#!/usr/bin/env node

type AllowedFlags = {
	help? : boolean
	name? : string
	age?  : string
}

const showHelp = ( type: 'error' | 'log' = 'log' ) => {

	console[type]( `
Usage: $0 [options]

Options:
  --help       Show this help message
  --name       Print a greeting with the provided name
  --age        Print your age
` )

}

const parseArgs = (): AllowedFlags => {

	const args                = process.argv.slice( 2 )
	const flags: AllowedFlags = {}

	for ( let i = 0; i < args.length; i++ ) {

		const arg = args[i]
		if ( arg.startsWith( '--' ) ) {

			const flagName = arg.slice( 2 ) as keyof AllowedFlags
			const nextArg  = args[i + 1]
			if ( nextArg && !nextArg.startsWith( '--' ) ) {

				// @ts-ignore
				flags[flagName] = nextArg
				i++

			}
			else {

				// @ts-ignore
				flags[flagName] = true

			}

		}

	}

	return flags

}

const flags = parseArgs()

if ( flags.help ) showHelp()
else if ( flags.name ) console.log( `Hello, ${flags.name}!` )
else if ( flags.age ) console.log( `You are ${flags.age} years old.` )
else if ( !flags.name && !flags.age ) console.log( 'Unknown command. Use --help for usage information.' )
else showHelp( 'error' )

```

### Build

Build executables for all operating systems and architectures (arm or x64) by automatically detecting the current JS runtime environment to build binaries.

```bash
binarium --input cli/app.ts
```

### Build with Specific runtime

Build with a specific runtime environment

```bash
# node
binarium node -i cli/app.ts
# deno
binarium deno -i cli/app.ts
# bun
binarium bun -i cli/app.ts

```



## JS example

Simple example of using JavaScript.
Builds the app found in the 'lib/app.js' file into an executable for the current system only.


### App file

This file is found in "lib/app.js"

```js twoslash
#!/usr/bin/env node

const showHelp = () => {

	console.log( `
Usage: $0 [options]

Options:
--help       Show this help message
--name       Print a greeting with the provided name
--age        Print your age
` )

}

const parseArgs = () => {

	const args  = process.argv.slice( 2 )
	const flags = {}

	for ( let i = 0; i < args.length; i++ ) {

		const arg = args[i]
		if ( arg.startsWith( '--' ) ) {

			const flagName = arg.slice( 2 )
			const nextArg  = args[i + 1]
			if ( nextArg && !nextArg.startsWith( '--' ) ) {

				// @ts-ignore
				flags[flagName] = nextArg
				i++ // Saltar al siguiente argumento

			}
			else {

				// @ts-ignore
				flags[flagName] = true

			}

		}

	}

	return flags

}

const main = () => {

	const flags = parseArgs()

	if ( flags.help ) showHelp()
	else {

		if ( flags.name ) console.log( `Hello, ${flags.name}!` )
		if ( flags.age ) console.log( `You are ${flags.age} years old.` )
		if ( !flags.name && !flags.age ) console.log( 'Unknown command. Use --help for usage information.' )

	}

}

main()


```

### Build file

This file is found in "lib/main.js"

```ts twoslash
import { build } from 'binarium'
import { join }  from 'node:path'

await build( {
	input  : join( import.meta.dirname, 'app' ),
	name   : 'binarium-test',
	onlyOs : true,
	type   : 'bin',
} )

```

### Execute

```bash
node lib/main.js
```



## TS example

Simple example of using TypeScript.
Builds the app found in the 'lib-ts/app.ts' file into an executable for the current system only.


### App file

This file is found in "lib-ts/app.ts"

```ts twoslash
#!/usr/bin/env node

type AllowedFlags = {
	help? : boolean
	name? : string
	age?  : string
}

const showHelp = ( type: 'error' | 'log' = 'log' ) => {

	console[type]( `
Usage: $0 [options]

Options:
  --help       Show this help message
  --name       Print a greeting with the provided name
  --age        Print your age
` )

}

const parseArgs = (): AllowedFlags => {

	const args                = process.argv.slice( 2 )
	const flags: AllowedFlags = {}

	for ( let i = 0; i < args.length; i++ ) {

		const arg = args[i]
		if ( arg.startsWith( '--' ) ) {

			const flagName = arg.slice( 2 ) as keyof AllowedFlags
			const nextArg  = args[i + 1]
			if ( nextArg && !nextArg.startsWith( '--' ) ) {

				// @ts-ignore
				flags[flagName] = nextArg
				i++

			}
			else {

				// @ts-ignore
				flags[flagName] = true

			}

		}

	}

	return flags

}

const flags = parseArgs()

if ( flags.help ) showHelp()
else if ( flags.name ) console.log( `Hello, ${flags.name}!` )
else if ( flags.age ) console.log( `You are ${flags.age} years old.` )
else if ( !flags.name && !flags.age ) console.log( 'Unknown command. Use --help for usage information.' )
else showHelp( 'error' )

```

### Build file

This file is found in "lib-ts/main.ts"

```ts twoslash
import { build } from 'binarium'
import { join }  from 'node:path'

await build( {
	input  : join( import.meta.dirname, 'app' ),
	name   : 'binarium-lib-test',
	onlyOs : true,
	type   : 'bin',
} )

```

### Execute

```bash
node lib-ts/main.ts
```



## Deno example

Simple example of build in **deno** runtime.


### Configuration file

```js twoslash
import { defineConfig } from 'binarium'

export const name = 'binarium-deno-test'

export default defineConfig( {
	name        : name,
	input       : 'examples/deno/app.js',
	onlyOs      : false,
	type        : 'compress',
	denoOptions : { flags: [ '--allow-all', '--no-npm' ] },
} )

```

### App file

```js twoslash

const args = globalThis.Deno?.args
if ( !args ) console.error( 'args not found' )

const command = args[0]

// cli.ts
const showHelp = () => {

	console.log( `
Usage:

  $0 <command> [options]

Commands:

  greet    Displays a greeting message.

Options:

  --help   Shows this help message.
  --name   Specifies a name to personalize the greeting.
` )

}

const greet = name => {

	console.log( `Hello, ${name}! Welcome to our CLI with Deno.` )

}

if ( args.includes( '--help' ) || !command ) showHelp()
else if ( command === 'greet' ) {

	const nameIndex = args.indexOf( '--name' )
	const name      = nameIndex !== -1 ? args[nameIndex + 1] : 'Friend'
	greet( name )

}
else {

	console.error( 'Unrecognized command. Use \'--help\' to see available commands.' )

}

```

### Execute

```bash
binarium deno -c deno/config.js
```



## Bun example

Simple example of build in **bun** runtime.


### Configuration file

```js twoslash
import { defineConfig } from 'binarium'

export default defineConfig( {
	name       : 'binarium-bun-test',
	input      : 'examples/bun/app',
	onlyOs     : false,
	type       : 'compress',
	bunOptions : { flags: [ '--packages external' ] },
} )

```

### App file

```ts twoslash
#!/usr/bin/env -S bun run

/* eslint-disable jsdoc/require-jsdoc */

import { argv } from 'node:process'

const args    = argv.slice( 2 )
const command = args[0]
const name    = 'binarium-bun-test'

function showHelp() {

	console.log( `
  Usage:

	${name} <command> [options]
  
  Commands:

	greet    Displays a greeting message.
  
  Options:

	--help   Shows this help message.
	--name   Specifies a name to personalize the greeting.
` )

}

function greet( name: string ) {

	console.log( `Hello, ${name}! Welcome to our CLI with Bun.` )

}

if ( args.includes( '--help' ) || !command ) {

	showHelp()

}
else if ( command === 'greet' ) {

	const nameIndex = args.indexOf( '--name' )
	const name      = nameIndex !== -1 ? args[nameIndex + 1] : 'Friend'
	greet( name )

}
else {

	console.log( 'Unrecognized command. Use \'--help\' to see available commands.' )

}

```

### Execute

```bash
binarium bun -c bun/config.js
```



## With assets

Create binaries with custom assets

### Run dovenv with a custom config file

```js twoslash
export default {
	input  : 'examples/assets/app.js',
	onlyOs : true,
	name   : 'example-assets',
	type   : 'bin',
	assets : [
		{
			from : 'examples/assets/public/**',
			to   : 'public',
		},
		{
			from : 'package.json',
			to   : 'public/package.json',
		},
	],
}

```

### App file

```js twoslash
#!/usr/bin/env node

/* eslint-disable @stylistic/multiline-ternary */
/* eslint-disable jsdoc/require-jsdoc */

import {
	readFile,
	readdir,
} from 'node:fs/promises'
import {
	join,
	dirname,
} from 'node:path'
import {
	argv,
	argv0,
	cwd,
	execPath,
} from 'node:process'
import { fileURLToPath } from 'node:url'

function showHelp() {

	console.log( `
Usage: $0 [options]

Options:

--help       Show this help message
--read       Read asset setting the name of the asset
--paths      Show bin paths
--ls         List specific bin paths
` )

}

const getPaths = async dirPath => {

	try {

		const paths = []
		const files = await readdir( dirPath )

		for ( const file of files ) {

			const fullPath = join( dirPath, file )

			try {

				paths.push( fullPath )

			}
			catch ( err ) {

				console.error( `Error reading file: ${err.message}` )

			}

		}
		return paths

	}
	catch ( err ) {

		console.error( `Error reading directory: ${err.message}` )

	}

}

function parseArgs() {

	const args  = process.argv.slice( 2 )
	const flags = {}

	for ( let i = 0; i < args.length; i++ ) {

		const arg = args[i]
		if ( arg.startsWith( '--' ) ) {

			const flagName = arg.slice( 2 )
			const nextArg  = args[i + 1]
			if ( nextArg && !nextArg.startsWith( '--' ) ) {

				// @ts-ignore
				flags[flagName] = nextArg
				i++ // Saltar al siguiente argumento

			}
			else {

				// @ts-ignore
				flags[flagName] = true

			}

		}

	}

	return flags

}
const convertError = data => data instanceof Error ? {
	message : data.message,
	stack   : data.stack ? data.stack.split( '\n' ) : [], // Convertir el stack a un array
	name    : data.name,
} : data

const __dirname = dirname( fileURLToPath( import.meta.url ) )
const workspace = join( __dirname, '..', '..' )
const system    = join( workspace, '..' )

async function main() {

	const flags = parseArgs()

	if ( flags.help ) showHelp()
	else {

		if ( flags.read ) {

			try {

				const path = join( __dirname, 'public', flags.read )
				const data = await readFile( path, 'utf8' )

				console.log( {
					path,
					data : data.toString(),
				} )

			}
			catch ( error ) {

				console.error( JSON.stringify( {
					id    : 'Error Reading file',
					error : convertError( error ),
				}, undefined, 2 ) )

			}

		}
		else if ( flags.paths ) {

			console.log( {
				dir            : __dirname,
				dirPaths       : await getPaths( __dirname ),
				workspace,
				workspacePaths : await getPaths( workspace ),
				system,
				systemPaths    : await getPaths( system ),
				cwd            : cwd(),
				execPath,
				argv,
				argv0,
			} )

		}
		else if ( flags.ls ) {

			console.log( `ls ${flags.ls}` )
			const paths = await getPaths( flags.ls )
			console.log( { paths } )

		}
		else if ( flags.cat ) {

			const content = await readFile( flags.cat, 'utf8' )
			console.log( content )

		}
		else showHelp()

	}

}

main()


```

### Run binarium via JS

```ts twoslash
import { build } from 'binarium'
import {
	dirname,
	join,
} from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname( fileURLToPath( import.meta.url ) )

await build( {
	input  : '',
	config : join( __dirname, 'config.js' ),
} )

```

### Run configuration via CLI

```bash
binarium -c my/custom/config.js
```



