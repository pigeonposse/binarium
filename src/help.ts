import { exit } from './_shared/process'

export const printHelp = ( name: string, description: string ): void => {

	name = name.toLowerCase()
	console.log( `${description}
		
Usage: ${name} <command> [...flags]

Commands:

  node              Build Node.js executables
  deno              Build Deno executables ('deno compile' wrapper)
  bun               Build Bun executables ('bun build --compile' wrapper)

  If no command is specified, [${name}] will automatically detect the runtime (Node.js, 
  Deno, or Bun) based on the input file or the current environment and build the 
  corresponding executable.
  It is recommended to specify the runtime to avoid unexpected errors.

Options:

  -i, --input       Input file path.
                    Accepted files: .ts, .js, .mjs, .mts, .cjs, .cts
                    The input can be provided without an extension. 
  -o, --outDir      Output directory path.
  -n, --name        Binary name.
  -t, --type        Binary type build
                    Supported values: all, cjs, bin
  --onlyOs          Build only binary for your current OS.
                    If is not set [${name}] will build a binary for every OS.
  -c, --config      Config file path.
                    Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml

Global options:

  -h, --help        Show help message
  -v, --version     Show version
  --debug           Debug mode

Examples: 

  Simple build:     ${name} --input src/main
  Custom output:    ${name} --input src/main.js --outDir out
  With Config file: ${name} --i src/main.ts --config my-config.js

  Build for node:   ${name} node -i src/main
  Build for deno:   ${name} deno -i src/main.js -o out
  Build for bun:    ${name} bun -i src/main.ts -n my-app
` )
	exit( 0 )

}
