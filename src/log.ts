import { logger } from './_shared/logger'
import {
	existsFlag,
	exit, 
} from './_shared/process'
import {
	version,
	name,
	BINARIUM_CONSTS,
} from './const'
import { printHelp } from './help'

export const getLog = () => {

	const projectName = BINARIUM_CONSTS.name || name
	const isDebug     = BINARIUM_CONSTS.debug || existsFlag( 'debug' ) || false
	return {
		...logger( {
			icon : BINARIUM_CONSTS.icon || '📦',
			name : projectName,
			isDebug,
		} ),
		isDebug,
		printHelp    : BINARIUM_CONSTS.onHelp ? () => BINARIUM_CONSTS.onHelp : () => printHelp( projectName ),
		printVersion : BINARIUM_CONSTS.onVersion ? () => BINARIUM_CONSTS.onVersion : () => {

			console.log( version )
			exit( 0 )
	
		},
	}

}
