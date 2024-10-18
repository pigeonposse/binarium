import { performance } from 'node:perf_hooks'

export const perf = () => {

	const start = performance.now()
	const stop  = () => `${( ( performance.now() - start ) / 1000 ).toFixed( 2 )}`
	return { stop }

}
