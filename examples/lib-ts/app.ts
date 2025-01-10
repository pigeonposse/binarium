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
