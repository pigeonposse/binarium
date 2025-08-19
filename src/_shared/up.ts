import { Updater } from '@clippium/updater'
import color       from 'chalk'

export const updater = async ( {
	name, version,
}:{
	name    : string
	version : string
} ) => {

	const _updater = new Updater( {
		version,
		name,
	} )

	const data = await _updater.get()

	if ( !data ) return

	console.log( `
        
║ 📦 ${color.bold( 'Update available' )} ${color.dim( data.currentVersion )} → ${color.green( data.latestVersion )} ${color.italic( `(${data.type})` )}
║ Run ${color.cyan( data.packageManager + ' i ' + name )} to update
		
` )

}
