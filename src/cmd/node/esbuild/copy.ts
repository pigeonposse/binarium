import { copy } from 'esbuild-plugin-copy'

/**
 * Esbuild plugin used to copy files or directories during the build process.
 *
 * Typically used for transferring static assets or configuration files
 * from source directories to the output directory.
 * @returns {Plugin} The esbuild plugin
 */
export const copyEsbuildPlugin = copy
