import {
	validate as z,
	formatValidationError,
	schema2type,
	serializeValidation,
} from '@dovenv/utils'

export const pkgSchema = z.object( {
	name        : z.string(),
	description : z.string(),
	homepage    : z.string(),
	funding     : z.object( { url: z.string().url() } ),
	repository  : z.object( { url: z.string().url() } ),
	bugs        : z.object( { url: z.string().url() } ),
	license     : z.string(),
	extra       : z.object( {
		productName : z.string(),
		libraryUrl  : z.string().url(),
		licenseUrl  : z.string().url(),
		libraryId   : z.string(),
		docsUrl     : z.string().url(),
		collective  : z.object( {
			id      : z.string(),
			name    : z.string(),
			funding : z.string().url(),
			about   : z.string().url(),
			url     : z.string().url(),
			email   : z.string().email(),
			gh      : z.string().url(),
			// socialUser : z.object( {
			// 	twitter   : z.string(),
			// 	instagram : z.string(),
			// 	medium    : z.string(),
			// } ),
			social  : z.object( {
				twitter   : z.string().url(),
				instagram : z.string().url(),
				medium    : z.string().url(),
			} ),
		} ),
	} ),
} )

export const markSchema = z.string()
export const projectSchema = z.object( {
	name        : z.string(),
	description : z.string(),
} )
export const validateSchema = async ( schema, data, title ) => {

	const result = schema.safeParse( data )
	if ( !result.success ) {

		const errorMessage = formatValidationError( result.error )

		const content = ( await schema2type( {
			schema          : serializeValidation( schema ),
			required        : true,
			noUnknownObject : true,
		} ) )

		throw `Error in dovenv configuration: [${title}] const invalid schema.\n\n[${title}] Schema must have: ${content}\n\n${errorMessage}`

	}

}
