export default {
	input  : 'examples/assets/app.js',
	onlyOs : true,
	name,
	type   : 'bin',
	assets : [
		{
			from : 'examples/assets/public/**',
			to   : 'public',
		},
		{
			from : 'package.json',
			to   : 'public/package.json',
		},
	],
}
