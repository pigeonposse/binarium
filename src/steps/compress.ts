
import { zipFilesInDirectory } from '../_shared/compress'
import { catchError }          from '../_shared/error'

type Opts = {
	input: string, 
	output: string, 
	isDebug?: boolean
	debug: ( data: object | string ) => void
}

export default async ( {
	input, output, debug,
}: Opts ) => {

	debug( {
		compressOpts : {
			input,
			output,
		}, 
	} )

	return await catchError( zipFilesInDirectory( input, output ) )

}
