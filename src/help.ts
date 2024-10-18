import { exit } from './_shared/process'

export const printHelp = ( name: string ): void => {

	name = name.toLowerCase()
	console.log( `Usage: ${name} [options]

Options:

  --input           Input file path.
                    Accepted files: .ts, .js, .mjs, .mts, .cjs, .cts
                    The input can be provided without an extension. 
  --outDir          Output directory path.
  --name            Binary name.
  --type            Binary type build
                    Supported values: all, cjs, bin
  --onlyOs          Build only binary for your current OS.
                    If is not set ${name} will build a binary for every OS.
  --config          Config file path.
                    Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml

Global options:

  --help            Show help message
  --version         Show version
  --debug           Debug mode
  
Examples: 

  ${name} --input src/main
  ${name} --input src/main.js --outDir out
  ${name} --input src/main.ts --name my-app
  ${name} --input src/main.ts --config my-config.js
` )
	exit( 0 )

}
