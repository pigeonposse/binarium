#!/usr/bin/env node
/* eslint-disable jsdoc/require-jsdoc */

function showHelp() {

	const name = 'binarium-lib-test'
	console.log( `
Usage: ${name} [options]

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

function main() {

	const flags = parseArgs()

	if ( flags.help ) showHelp()
	else {

		if ( flags.name ) console.log( `Hello, ${flags.name}!` )
		if ( flags.age ) console.log( `You are ${flags.age} years old.` )
		if ( !flags.name && !flags.age ) console.log( 'Unknown command. Use --help for usage information.' )

	}

}

main()

