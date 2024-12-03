/* eslint-disable @stylistic/multiline-ternary */
import c   from 'chalk'
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

	}
	else if ( 'data' in data && data.data instanceof Error ) data.data = convertError( data.data )

	return data

}

export const logger = (
	{
		icon,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		name,
		isDebug = false,
	}: {
		icon?    : string
		name     : string
		isDebug? : boolean
	},
) => {

	const icons = {
		error   : `${icon}🔴`,
		warn    : `${icon}🟡`,
		info    : `${icon}🔵`,
		debug   : `${icon}⚫️`,
		success : `${icon}🟢`,
	}
	const color = {
		error   : c.red,
		warn    : c.yellow,
		info    : c.cyan,
		debug   : c.dim,
		success : c.green,
	}

	const setLog = ( data: LogData, logType: LogType, withName?: boolean ) => {

		const logMethod = logType === 'success' ? 'info' : logType

		const title = color[logType]( `${icons[logType] || icon}${withName ? '' : ''}` )
		if ( typeof data === 'string' ) console[logMethod]( `${logType === 'debug' ? '\n' : ''}${title} ${color[logType]( data )}` )
		else if ( data !== undefined ) {

			console[logMethod]( title )
			console.dir( transform( data ), {
				depth  : Infinity,
				colors : true,
			} )

		}

	}

	// if ( !isDebug ) console.debug = () => { }
	// else console.debug = m => setLog( m, 'debug' )

	// console.error = m => setLog( m, 'error' )
	// console.info  = m => setLog( m, 'info' )
	// console.warn  = m => setLog( m, 'warn' )

	return {
		debug : ( data: LogData, withName = true ) => {

			if ( isDebug ) setLog( data, 'debug', withName )

		},
		group : ( data: LogData ) => ( {
			start : () => {

				setLog( data, 'debug', false )
				// necessry empty string because if is empty bun print a undefined in the console
				console.group( '' )

			},
			// @ts-ignore: necessry empty string because if is empty bun print a undefined in the console
			end : () => console.groupEnd( '' ),
		} ),
		spinner : ( text: string ) => {

			if ( isDebug ) {

				return {
					start   : () => setLog( text, 'info', false ),
					text    : ( v:string ) => setLog( v, 'info', false ),
					info    : ( v:string ) => setLog( v, 'info', false ),
					succeed : ( v:string ) => setLog( v, 'success', false ),
					fail    : ( v:string ) => setLog( v, 'error', false ),
				}

			}
			else {

				const s = ora( text )

				return {
					start   : () => s.start( ),
					text    : ( v: string ) => s.text = v,
					info    : ( v:string ) => s.info( v ),
					succeed : ( v:string ) => s.succeed( v ),
					fail    : ( v:string ) => s.fail( v ),
				}

			}

		},
		info    : ( data: LogData, withName = true ) => setLog( data, 'info', withName ),
		success : ( data: LogData, withName = true ) => setLog( data, 'success', withName ),
		warn    : ( data: LogData, withName = true ) => setLog( data, 'warn', withName ),
		error   : ( data: LogData, withName = true ) => setLog( data, 'error', withName ),
	}

}
