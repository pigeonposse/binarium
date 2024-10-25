import ora from 'ora'

type LogType = 'warn' | 'error' | 'info' | 'debug' | 'success'
type LogData = object | string

const convertError = ( data: object ) => data instanceof Error ? {
	message : data.message ? data.message.split( '\n' ) : [],
	stack   : data.stack ? data.stack.split( '\n' ) : [], // Convertir el stack a un array
	name    : data.name,
} : data

const transform = ( data: object ) => {

	if ( data instanceof Error ) data = convertError( data )

	if ( 'data' in data 
			&& typeof data.data === 'object' && data.data !== null
			&& 'error' in data.data 
			&& data.data.error instanceof Error 
	) {

		data.data.error = convertError( data.data.error )
		
	}else if ( 'data' in data && data.data instanceof Error ) data.data = convertError( data.data )

	return data

}

export const logger = ( 
	{ 
		icon,
		name,
		isDebug = false, 
	}: {
		icon?: string
		name: string
		isDebug?:boolean
	}, 
) => {

	const icons = {
		error   : `${icon}🔴`,
		warn    : `${icon}🟡`,
		info    : `${icon}🔵`,
		debug   : `${icon}⚫️`,
		success : `${icon}🟢`,
	}
	
	const setLog = ( data: LogData, logType: LogType, withName?: boolean ) => {

		const logMethod = logType === 'success' ? 'info' : logType

		const title = `${icons[ logType ] || icon}${withName ? ` [${name}]` : ''}` 
		if( typeof data === 'string' ) console[ logMethod ]( `${logType === 'debug' ? '\n' : ''}${title} ${data}` )
		else {

			console[ logMethod ]( title )
			console.dir( transform( data ), {
				depth  : Infinity,
				colors : true, 
			} )
		
		}
			
	}

	return {
		debug : ( data: LogData, withName = true ) => isDebug && setLog( data, 'debug', withName ),
		group : ( data: LogData ) => ( {
			start : () => {

				setLog( data, 'debug', false )
				console.group( )
			
			},
			end : () => console.groupEnd( ),
		} ),
		spinner : ( text: string ) => {

			const s = ora( text )
			s.start()
			return s
		
		},
		info    : ( data: LogData, withName = true ) => setLog( data, 'info', withName ),
		success : ( data: LogData, withName = true ) => setLog( data, 'success', withName ),
		warn    : ( data: LogData, withName = true ) => setLog( data, 'warn', withName ),
		error   : ( data: LogData, withName = true ) => setLog( data, 'error', withName ),
	} 

}
