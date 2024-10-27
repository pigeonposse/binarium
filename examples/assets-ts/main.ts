import {
	build,
	BINARIUM_CONSTS, 
} from 'binarium'

import { name }    from './config'
import {
	join,
	getCurrFileDir,
} from '../utils'

BINARIUM_CONSTS.name = name

await build( {
	input  : '',
	config : join( getCurrFileDir( import.meta.url ), 'config.js' ),
} )
