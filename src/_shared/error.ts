export const catchError = async <T>( promise: Promise<T> ): Promise<[undefined, T] | [Error]> => {

	return promise
		.then( value => ( [ undefined, value ] as unknown as [undefined, T] ) )
		.catch( error => ( [ error ] ) )

}
