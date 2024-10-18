import { defineConfig } from 'binarium'

export default defineConfig( {
	name    : 'my-app-name',
	onlyOs  : true,
	options : { esbuild: { tsconfig: './tsconfig.builder.json' } },
} )
