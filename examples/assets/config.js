// import { defineConfig } from 'binarium'

// export const name = 'binarium-assets-test'
// export default defineConfig( {
// 	input  : 'examples/assets/app.js',
// 	onlyOs : true,
// 	name,
// 	type   : 'bin',
// 	assets : [ {
// 		from : 'examples/assets/public/**',
// 		to   : 'public', 
// 	}, {
// 		from : 'package.json',
// 		to   : 'public/package.json', 
// 	} ],
// } )

export const name = 'binarium-assets-test'
export default {
	input  : 'examples/assets/app.js',
	onlyOs : true,
	name,
	type   : 'bin',
	assets : [ {
		from : 'examples/assets/public/**',
		to   : 'public', 
	}, {
		from : 'package.json',
		to   : 'public/package.json', 
	} ],
}
