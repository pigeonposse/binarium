import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'

const CONSTS = await getWorkspaceConfig( {
	metaURL : import.meta.url,
	path    : '../',
	corePath: './'
} )

export default CONSTS
