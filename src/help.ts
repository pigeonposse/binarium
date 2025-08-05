import color from 'chalk'

import { exit }  from './_shared/process'
import {
	CONFIG_EXTS,
	INPUT_EXTS,
	BUILDER_TYPE,
} from './const'

const {
	bold,
	green,
	dim,
	italic,
	yellow,
	cyan,
	inverse,
	magenta,
} = color

export const printHelp = ( name: string, description: string, docsURL: string ): void => {

	const extsList = ( obj: Record<string, string> ) => italic( Object.values( obj ).map( ext => `.${ext}` ).join( ' ' ) )
	const objList  = ( obj: Record<string, string> ) => italic( Object.values( obj ).join( ', ' ) )
	name           = name.toLowerCase()

	console.log( `${inverse.bold( ' ' + name + ' help ' )}

${description}

${bold( 'Usage:' )} ${cyan( name )} ${green( '<command>' )} ${yellow( '[...flags]' )} 

${bold( 'Commands:' )}

  ${green( 'node' )}              ${dim( 'Build Node.js executables' )}
  ${green( 'deno' )}              ${dim( 'Build Deno executables (\'deno compile\' wrapper)' )}
  ${green( 'bun' )}               ${dim( 'Build Bun executables (\'bun build --compile\' wrapper)' )}

  ${dim( `If no command is specified, [${cyan( name )}] will automatically detect the runtime (Node.js,` )}
  ${dim( `Deno, or Bun) based on the input file or the current environment and build the` )}
  ${dim( `corresponding executable. It is recommended to specify the runtime to avoid unexpected errors.` )}

${bold( 'Options:' )}      

  ${yellow( '-i, --input' )}       ${dim( 'Input file path.' )}
                    ${dim( 'Accepted files: ' + extsList( INPUT_EXTS ) )}
                    ${dim( 'The input can be provided without an extension.' )}
  ${yellow( '-o, --output' )}      ${dim( 'Output directory path.' )}
  ${yellow( '-n, --name' )}        ${dim( 'Binary name.' )}
  ${yellow( '-t, --type' )}        ${dim( 'Binary type build' )}
                    ${dim( 'Supported values: ' + objList( BUILDER_TYPE ) )}
  ${yellow( '-O, --onlyOs' )}      ${dim( 'Build only binary for your current OS.' )}
                    ${dim( `If not set, [${cyan( name )}] will build a binary for every OS.` )}
  ${yellow( '-c, --config' )}      ${dim( 'Config file path.' )}
                    ${dim( 'Files supported: ' + extsList( CONFIG_EXTS ) )}

${bold( 'Global options:' )}

  ${yellow( '-h, --help' )}        ${dim( 'Show help message' )}
  ${yellow( '-v, --version' )}     ${dim( 'Show version' )}
  ${yellow( '--debug' )}           ${dim( 'Debug mode' )}

${bold( 'Examples:' )}

  ${dim( 'Simple build' )}      ${cyan( `${name} --input src/main` )}
  ${dim( 'Custom output' )}     ${cyan( `${name} --input src/main.js --output out` )}
  ${dim( 'With Config file' )}  ${cyan( `${name} -i src/main.ts --config my-config.js` )}

  ${dim( 'Build for node' )}    ${cyan( `${name} node -i src/main` )}
  ${dim( 'Build for deno' )}    ${cyan( `${name} deno -i src/main.js -o out` )}
  ${dim( 'Build for bun' )}     ${cyan( `${name} bun -i src/main.ts -n my-app` )}

${bold( 'More info:' )}          ${magenta.underline( docsURL )}
	` )

	exit( 0 )

}
