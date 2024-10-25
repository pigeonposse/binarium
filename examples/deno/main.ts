import { buildDeno } from 'binarium'

import {
	getCurrFileDir,
	showBinPaths,
	join, 
} from '../utils'

await buildDeno( {
	input  : '',
	config : join( getCurrFileDir( import.meta.url ), 'config.js' ),
} )

await showBinPaths()
