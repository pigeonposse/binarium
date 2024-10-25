import { logger } from './_shared/logger'
import {
	existsFlag,
	exit, 
} from './_shared/process'
import { perf } from './_shared/time'
import {
	version,
	name,
	BINARIUM_CONSTS,
	description,
} from './const'
import { printHelp } from './help'

export const getLog = () => {

	const projectName = BINARIUM_CONSTS.name || name
	const isDebug     = BINARIUM_CONSTS.debug || existsFlag( 'debug' ) || false
	const log         = logger( {
		icon : BINARIUM_CONSTS.icon || '📦',
		name : projectName,
		isDebug,
	} )
	return {
		...log,
		isDebug,
		printHelp    : BINARIUM_CONSTS.onHelp ? () => BINARIUM_CONSTS.onHelp : () => printHelp( projectName, description ),
		printVersion : BINARIUM_CONSTS.onVersion ? () => BINARIUM_CONSTS.onVersion : () => {

			console.log( version )
			exit( 0 )
	
		},
		performance : perf,
		name        : projectName.toLowerCase(),
	}

}
