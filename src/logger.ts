const icon = '💾'
export const logger = ( 
	{ 
		name,
		isDebug = false, 
	}: {
		name: string
		isDebug?:boolean
	}, 
) => ( {

	debug : ( data: object | string ) => isDebug && console.debug( `\n${icon}⬛`, data ),
	group : ( data: object | string ) => ( {
		start : () => {

			console.log( `\n${icon}⬛`, data )
			console.group( )
			
		},
		end : () => console.groupEnd( ),
	} ),
	info    : ( data: object | string ) => console.log( `\n${icon}🟦 [${name}]`, data ),
	success : ( data: object | string ) => console.log( `\n${icon}✅ [${name}]`, data ),
	warn    : ( data: object | string ) => console.warn( `\n${icon}🟡 [${name}]`, data ),
	error   : ( data: object | string ) => console.error( `\n${icon}❌ [${name}]`, data ),
} )
