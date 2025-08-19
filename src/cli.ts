#!/usr/bin/env node

import { updater } from './_shared/up'
import {
	name,
	version,
} from './const'
import { build } from './index'

const run = async () => {

	await build( { input: '' } )
	await updater( {
		name,
		version,
	} )

}

run()
