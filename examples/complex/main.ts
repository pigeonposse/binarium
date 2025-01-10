import {
	build,
	BINARIUM_CONSTS,
} from 'binarium'

import { name } from './config'
import {
	getCurrFileDir,
	join,
} from '../utils'

BINARIUM_CONSTS.name = name // overrite binarium help name. Use it if you want implement this in your own library
await build( {
	input  : '',
	name   : BINARIUM_CONSTS.name,
	config : join( getCurrFileDir( import.meta.url ), 'config.js' ),
} )
