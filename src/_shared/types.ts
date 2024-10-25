export type Prettify<T> = {
	[K in keyof T]: Prettify<T[K]>;
} & {}
