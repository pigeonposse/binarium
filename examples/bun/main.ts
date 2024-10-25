import { buildBun } from 'binarium'

import {
	getCurrFileDir,
	showBinPaths,
	join, 
} from '../utils'

await buildBun( {
	input  : '',
	config : join( getCurrFileDir( import.meta.url ), 'config.js' ),
} )

await showBinPaths()
