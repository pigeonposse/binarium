import { buildDeno } from 'binarium'

import {
	getCurrFileDir,
	join, 
} from '../utils'

await buildDeno( {
	input  : '',
	config : join( getCurrFileDir( import.meta.url ), 'config.js' ),
} )
