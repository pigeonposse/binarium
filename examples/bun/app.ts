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
