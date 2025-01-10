
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
