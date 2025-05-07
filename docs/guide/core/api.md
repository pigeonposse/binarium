# `Binarium` - API documentation

## Functions

### build()

```ts
function build(params: BuilderParams): Promise<void>
```

Package your cli application for different platforms and architectures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuilderParams`](#builderparams) | The parameters for creating the binaries. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the binary creation process is complete.

#### Example

```ts
import { build } from 'binarium'

build({
  input: 'examples/app',
  // name: 'my-app-name',
  // output: resolve('build'),
  // type: 'all',
})
```

***

### buildAuto()

```ts
function buildAuto(params: BuilderParams): Promise<void>
```

Package your cli application for different platforms and architectures.
Autodectect runtime (node, deno, bun).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuilderParams`](#builderparams) | The parameters for creating the binaries. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the binary creation process is complete.

#### Example

```ts
import { buildAuto } from 'binarium'

buildAuto({
  input: 'examples/app',
  // name: 'my-app-name',
  // output: resolve('build'),
  // type: 'all',
})
```

***

### buildBun()

```ts
function buildBun(params: BuilderParams): Promise<void>
```

Package your Bun cli application for different platforms and architectures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuilderParams`](#builderparams) | The parameters for creating the binaries. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the binary creation process is complete.

#### Example

```ts
import { buildBun } from 'binarium'

buildBun({
  input: 'examples/app',
  // name: 'my-app-name',
  // output: resolve('build'),
  // type: 'all',
})
```

***

### buildDeno()

```ts
function buildDeno(params: BuilderParams): Promise<void>
```

Package your Deno cli application for different platforms and architectures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuilderParams`](#builderparams) | The parameters for creating the binaries. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the binary creation process is complete.

#### Example

```ts
import { buildDeno } from 'binarium'

buildDeno({
  input: 'examples/app',
  // name: 'my-app-name',
  // output: resolve('build'),
  // type: 'all',
})
```

***

### buildNode()

```ts
function buildNode(params: BuilderParams): Promise<void>
```

Package your Node.js cli application for different platforms and architectures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuilderParams`](#builderparams) | The parameters for creating the binaries. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the binary creation process is complete.

#### Example

```ts
import { buildNode } from 'binarium'

buildNode({
  input: 'examples/app',
  // name: 'my-app-name',
  // output: resolve('build'),
  // type: 'all',
})
```

***

### defineConfig()

```ts
function defineConfig(config: {
  assets: {
     from: string;
     to: string;
    }[];
  bunOptions: {
     flags: string[];
    };
  config: string;
  denoOptions: {
     flags: string[];
    };
  input: string;
  name: string;
  nodeOptions: {
     esbuild: false | {
        noDefaultPlugins: boolean;
       };
     ncc: false | {
        assetBuilds: boolean;
        cache: string | false;
        externals: string[];
        filterAssetBase: string;
        license: string;
        minify: boolean;
        sourceMap: boolean;
        sourceMapBasePrefix: string;
        sourceMapRegister: boolean;
        target: string;
        v8cache: boolean;
        watch: boolean;
       };
     pkg: {
        assets: string | string[];
        compress: "Gzip" | "Brotli";
        flags: string[];
        ignore: string[];
        input: string;
        name: string;
        output: string;
        scripts: string | string[];
        targets: string[];
       };
    };
  onlyOs: boolean;
  output: string;
  type: BuilderType;
 }): {
  assets: {
     from: string;
     to: string;
    }[];
  bunOptions: {
     flags: string[];
    };
  config: string;
  denoOptions: {
     flags: string[];
    };
  input: string;
  name: string;
  nodeOptions: {
     esbuild: false | {
        noDefaultPlugins: boolean;
       };
     ncc: false | {
        assetBuilds: boolean;
        cache: string | false;
        externals: string[];
        filterAssetBase: string;
        license: string;
        minify: boolean;
        sourceMap: boolean;
        sourceMapBasePrefix: string;
        sourceMapRegister: boolean;
        target: string;
        v8cache: boolean;
        watch: boolean;
       };
     pkg: {
        assets: string | string[];
        compress: "Gzip" | "Brotli";
        flags: string[];
        ignore: string[];
        input: string;
        name: string;
        output: string;
        scripts: string | string[];
        targets: string[];
       };
    };
  onlyOs: boolean;
  output: string;
  type: BuilderType;
}
```

Define the configuration for the binary builder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | `object` | The configuration object. |
| `config.assets`? | \{ `from`: `string`; `to`: `string`; \}[] | **`Experimental`** Assets for you app. **Example** `{   * from: 'src/assets',   * to: 'assets'   * }` |
| `config.bunOptions`? | `object` | Custom `bun` build configuration. Override options for Bun executable build. |
| `config.bunOptions.flags` | `string`[] | Custom flags for `bun build --compile` cmd. For help, run: `bun build --help`. **See** <https://bun.sh/docs/bundler> **Example** `[ '--minify' ]` |
| `config.config`? | `string` | Config file path. Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml. **Default** `undefined` |
| `config.denoOptions`? | `object` | Custom `deno` build configuration. Override options for deno executable build. |
| `config.denoOptions.flags` | `string`[] | Custom flags for `deno compile` cmd. For help, run: `deno compile --help`. **See** <https://docs.deno.com/go/compile> **Example** `[ '--allow-all', '--no-prompt' ]` |
| `config.input`? | `string` | The app input file. The input can be provided without an extension. If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`. |
| `config.name`? | `string` | Binary name. |
| `config.nodeOptions`? | `object` | **`Experimental`** Custom `node` build configuration. Override build options for different build steps. Use this for advanced use cases. |
| `config.nodeOptions.esbuild`? | `false` \| \{ `noDefaultPlugins`: `boolean`; \} | **`Experimental`** ESBUILD configuration. **See** <https://esbuild.github.io/api/#build> |
| `config.nodeOptions.ncc`? | `false` \| \{ `assetBuilds`: `boolean`; `cache`: `string` \| `false`; `externals`: `string`[]; `filterAssetBase`: `string`; `license`: `string`; `minify`: `boolean`; `sourceMap`: `boolean`; `sourceMapBasePrefix`: `string`; `sourceMapRegister`: `boolean`; `target`: `string`; `v8cache`: `boolean`; `watch`: `boolean`; \} | **`Experimental`** NCC configuration. **See** <https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs> |
| `config.nodeOptions.pkg`? | `object` | **`Experimental`** PKG configuration. **See** <https://www.npmjs.com/package/@yao-pkg/pkg> |
| `config.nodeOptions.pkg.assets`? | `string` \| `string`[] | Assets is a glob or list of globs. Files specified as assets will be packaged into executable as raw content without modifications. Javascript files may also be specified as assets. Their sources will not be stripped as it improves execution performance of the files and simplifies debugging. Relative to input. Default input: build/cjs. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#assets> |
| `config.nodeOptions.pkg.compress`? | `"Gzip"` \| `"Brotli"` | Pass --compress Brotli or --compress GZip to pkg to compress further the content of the files store in the exectable. This option can reduce the size of the embedded file system by up to 60%. The startup time of the application might be reduced slightly. |
| `config.nodeOptions.pkg.flags`? | `string`[] | Custom flags for the pkg command. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#usage> |
| `config.nodeOptions.pkg.ignore`? | `string`[] | Ignore is a list of globs. Files matching the paths specified as ignore will be excluded from the final executable. This is useful when you want to exclude some files from the final executable, like tests, documentation or build files that could have been included by a dependency. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#ignore-files> |
| `config.nodeOptions.pkg.input`? | `string` | Input of the js code. |
| `config.nodeOptions.pkg.name`? | `string` | Binary name. This overrirides the default name. |
| `config.nodeOptions.pkg.output`? | `string` | Output for the binaries. This overrirides the default output path. |
| `config.nodeOptions.pkg.scripts`? | `string` \| `string`[] | Scripts is a glob or list of globs. Files specified as scripts will be compiled using v8::ScriptCompiler and placed into executable without sources. They must conform to the JS standards of those Node.js versions you target. Relative to input. Default input: build/cjs. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#scripts> |
| `config.nodeOptions.pkg.targets`? | `string`[] | Targets of your binary. Must be a list of strings in the following format: \{nodeRange\}-\{platform\}-[arch]. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#targets> **Example** `[ 'node18-macos-x64', 'node14-linux-arm64']` |
| `config.onlyOs`? | `boolean` | Build only binary for your current OS. **Default** `false` |
| `config.output`? | `string` | Directory for the output build. **Default** `'./build'` |
| `config.type`? | [`BuilderType`](#buildertype) | The build type Result. Supported: "bin", "all", "bundle", "compress" **Default** `'all'` |

#### Returns

```ts
{
  assets: {
     from: string;
     to: string;
    }[];
  bunOptions: {
     flags: string[];
    };
  config: string;
  denoOptions: {
     flags: string[];
    };
  input: string;
  name: string;
  nodeOptions: {
     esbuild: false | {
        noDefaultPlugins: boolean;
       };
     ncc: false | {
        assetBuilds: boolean;
        cache: string | false;
        externals: string[];
        filterAssetBase: string;
        license: string;
        minify: boolean;
        sourceMap: boolean;
        sourceMapBasePrefix: string;
        sourceMapRegister: boolean;
        target: string;
        v8cache: boolean;
        watch: boolean;
       };
     pkg: {
        assets: string | string[];
        compress: "Gzip" | "Brotli";
        flags: string[];
        ignore: string[];
        input: string;
        name: string;
        output: string;
        scripts: string | string[];
        targets: string[];
       };
    };
  onlyOs: boolean;
  output: string;
  type: BuilderType;
}
```

- The configuration object.

| Name | Type | Description |
| ------ | ------ | ------ |
| `assets`? | \{ `from`: `string`; `to`: `string`; \}[] | **`Experimental`** Assets for you app. **Example** `{   * from: 'src/assets',   * to: 'assets'   * }` |
| `bunOptions`? | \{ `flags`: `string`[]; \} | Custom `bun` build configuration. Override options for Bun executable build. |
| `bunOptions.flags` | `string`[] | Custom flags for `bun build --compile` cmd. For help, run: `bun build --help`. **See** <https://bun.sh/docs/bundler> **Example** `[ '--minify' ]` |
| `config`? | `string` | Config file path. Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml. **Default** `undefined` |
| `denoOptions`? | \{ `flags`: `string`[]; \} | Custom `deno` build configuration. Override options for deno executable build. |
| `denoOptions.flags` | `string`[] | Custom flags for `deno compile` cmd. For help, run: `deno compile --help`. **See** <https://docs.deno.com/go/compile> **Example** `[ '--allow-all', '--no-prompt' ]` |
| `input`? | `string` | The app input file. The input can be provided without an extension. If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`. |
| `name`? | `string` | Binary name. |
| `nodeOptions`? | \{ `esbuild`: `false` \| \{ `noDefaultPlugins`: `boolean`; \}; `ncc`: `false` \| \{ `assetBuilds`: `boolean`; `cache`: `string` \| `false`; `externals`: `string`[]; `filterAssetBase`: `string`; `license`: `string`; `minify`: `boolean`; `sourceMap`: `boolean`; `sourceMapBasePrefix`: `string`; `sourceMapRegister`: `boolean`; `target`: `string`; `v8cache`: `boolean`; `watch`: `boolean`; \}; `pkg`: \{ `assets`: `string` \| `string`[]; `compress`: `"Gzip"` \| `"Brotli"`; `flags`: `string`[]; `ignore`: `string`[]; `input`: `string`; `name`: `string`; `output`: `string`; `scripts`: `string` \| `string`[]; `targets`: `string`[]; \}; \} | **`Experimental`** Custom `node` build configuration. Override build options for different build steps. Use this for advanced use cases. |
| `nodeOptions.esbuild`? | `false` \| \{ `noDefaultPlugins`: `boolean`; \} | **`Experimental`** ESBUILD configuration. **See** <https://esbuild.github.io/api/#build> |
| `nodeOptions.ncc`? | `false` \| \{ `assetBuilds`: `boolean`; `cache`: `string` \| `false`; `externals`: `string`[]; `filterAssetBase`: `string`; `license`: `string`; `minify`: `boolean`; `sourceMap`: `boolean`; `sourceMapBasePrefix`: `string`; `sourceMapRegister`: `boolean`; `target`: `string`; `v8cache`: `boolean`; `watch`: `boolean`; \} | **`Experimental`** NCC configuration. **See** <https://github.com/vercel/ncc?tab=readme-ov-file#programmatically-from-nodejs> |
| `nodeOptions.pkg`? | \{ `assets`: `string` \| `string`[]; `compress`: `"Gzip"` \| `"Brotli"`; `flags`: `string`[]; `ignore`: `string`[]; `input`: `string`; `name`: `string`; `output`: `string`; `scripts`: `string` \| `string`[]; `targets`: `string`[]; \} | **`Experimental`** PKG configuration. **See** <https://www.npmjs.com/package/@yao-pkg/pkg> |
| `nodeOptions.pkg.assets`? | `string` \| `string`[] | Assets is a glob or list of globs. Files specified as assets will be packaged into executable as raw content without modifications. Javascript files may also be specified as assets. Their sources will not be stripped as it improves execution performance of the files and simplifies debugging. Relative to input. Default input: build/cjs. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#assets> |
| `nodeOptions.pkg.compress`? | `"Gzip"` \| `"Brotli"` | Pass --compress Brotli or --compress GZip to pkg to compress further the content of the files store in the exectable. This option can reduce the size of the embedded file system by up to 60%. The startup time of the application might be reduced slightly. |
| `nodeOptions.pkg.flags`? | `string`[] | Custom flags for the pkg command. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#usage> |
| `nodeOptions.pkg.ignore`? | `string`[] | Ignore is a list of globs. Files matching the paths specified as ignore will be excluded from the final executable. This is useful when you want to exclude some files from the final executable, like tests, documentation or build files that could have been included by a dependency. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#ignore-files> |
| `nodeOptions.pkg.input`? | `string` | Input of the js code. |
| `nodeOptions.pkg.name`? | `string` | Binary name. This overrirides the default name. |
| `nodeOptions.pkg.output`? | `string` | Output for the binaries. This overrirides the default output path. |
| `nodeOptions.pkg.scripts`? | `string` \| `string`[] | Scripts is a glob or list of globs. Files specified as scripts will be compiled using v8::ScriptCompiler and placed into executable without sources. They must conform to the JS standards of those Node.js versions you target. Relative to input. Default input: build/cjs. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#scripts> |
| `nodeOptions.pkg.targets`? | `string`[] | Targets of your binary. Must be a list of strings in the following format: \{nodeRange\}-\{platform\}-[arch]. **See** <https://github.com/yao-pkg/pkg?tab=readme-ov-file#targets> **Example** `[ 'node18-macos-x64', 'node14-linux-arm64']` |
| `onlyOs`? | `boolean` | Build only binary for your current OS. **Default** `false` |
| `output`? | `string` | Directory for the output build. **Default** `'./build'` |
| `type`? | [`BuilderType`](#buildertype) | The build type Result. Supported: "bin", "all", "bundle", "compress" **Default** `'all'` |

#### Example

```ts
import { defineConfig } from 'binarium'

export default defineConfig({
  name: 'my-app-name',
  onlyOs: true,
  nodeOptions: {
    esbuild: {
       tsconfig: './tsconfig.custom.json'
    }
  }
})
```

## Type Aliases

### BuilderContructorParams

```ts
type BuilderContructorParams: GetDataParams & {
  data: Awaited<ReturnType<typeof getData>>;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `data` | `Awaited`\<`ReturnType`\<*typeof* `getData`\>\> |

***

### BuilderErrors

```ts
type BuilderErrors: typeof ERROR_ID[keyof typeof ERROR_ID];
```

***

### BuilderParams

```ts
type BuilderParams: {
  config: string;
  input: string;
  name: string;
  onlyOs: boolean;
  output: string;
  type: BuilderType;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `config`? | `string` | Config file path. Files supported: .mjs, .js, .json, .yml, .yaml, .toml, .tml. **Default** `undefined` |
| `input` | `string` | The app input file. The input can be provided without an extension. If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`. |
| `name`? | `string` | Binary name. |
| `onlyOs`? | `boolean` | Build only binary for your current OS. **Default** `false` |
| `output`? | `string` | Directory for the output build. **Default** `'./build'` |
| `type`? | [`BuilderType`](#buildertype) | The build type Result. Supported: "bin", "all", "bundle", "compress" **Default** `'all'` |

***

### BuilderType

```ts
type BuilderType: typeof BUILDER_TYPE[keyof typeof BUILDER_TYPE];
```

***

### Cmd

```ts
type Cmd: typeof CMD[keyof typeof CMD];
```

***

### ConfigParams

```ts
type ConfigParams: Prettify<Partial<BuilderParams> & Config & {
  assets: {
     from: string;
     to: string;
    }[];
}>;
```

***

### GetDataParams

```ts
type GetDataParams: BuilderParams & {
  catchError: typeof catchError;
  consts: typeof CONSTS;
  Error: typeof BuildError;
  log: ReturnType<typeof getLog>;
};
```

#### Type declaration

| Name | Type |
| ------ | ------ |
| `catchError` | *typeof* `catchError` |
| `consts` | *typeof* `CONSTS` |
| `Error` | *typeof* `BuildError` |
| `log` | `ReturnType`\<*typeof* `getLog`\> |

## Variables

### BINARIUM\_CONSTS

```ts
const BINARIUM_CONSTS: {
  debug: boolean;
  desc: string;
  docsURL: string;
  icon: string;
  name: string;
  onHelp: () => void;
  onVersion: () => void;
};
```

Binarium constants for use in CLI output.

Overwrite these values at your own risk.

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `debug`? | `boolean` | Override debug mode |
| `desc`? | `string` | CLI Description |
| `docsURL`? | `string` | Documentation URL |
| `icon`? | `string` | CLI Icon |
| `name`? | `string` | CLI name |
| `onHelp`? | () => `void` | Override onHelp output |
| `onVersion`? | () => `void` | Override onVersion output |

***

### BUILDER\_TYPE

```ts
const BUILDER_TYPE: {
  ALL: 'all';
  BIN: 'bin';
  BUNDLE: 'bundle';
  COMPRESS: 'compress';
};
```

Object with builder types values

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `ALL` | `"all"` | 'all' |
| `BIN` | `"bin"` | 'bin' |
| `BUNDLE` | `"bundle"` | 'bundle' |
| `COMPRESS` | `"compress"` | 'compress' |

***

### CMD

```ts
const CMD: {
  AUTO: 'auto';
  BUN: 'bun';
  DENO: 'deno';
  NODE: 'node';
};
```

Command types

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `AUTO` | `"auto"` | 'auto' |
| `BUN` | `"bun"` | 'bun' |
| `DENO` | `"deno"` | 'deno' |
| `NODE` | `"node"` | 'node' |

***

### ERROR\_ID

```ts
const ERROR_ID: {
  NO_INPUT: 'NO_INPUT';
  ON_BUN_COMPILE: 'ON_BUN_COMPILE';
  ON_COMPRESSION: 'ON_COMPRESSION';
  ON_CONFIG: 'ON_CONFIG';
  ON_DENO_COMPILE: 'ON_DENO_COMPILE';
  ON_ESBUILD: 'ON_ESBUILD';
  ON_NCC: 'ON_NCC';
  ON_PKG: 'ON_PKG';
  PLATFORM_UNKWON: 'PLATFORM_UNKWON';
  PROCESS_NODE: 'PROCESS_NODE';
  RUNTIME_BUN: 'RUNTIME_BUN';
  RUNTIME_DENO: 'RUNTIME_DENO';
  RUNTIME_NODE: 'RUNTIME_NODE';
  RUNTIME_UNKNOWN: 'RUNTIME_UNKNOWN';
  UNEXPECTED: 'UNEXPECTED';
};
```

Object with all library errors ID values

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `NO_INPUT` | `"NO_INPUT"` | 'NO\_INPUT' |
| `ON_BUN_COMPILE` | `"ON_BUN_COMPILE"` | 'ON\_BUN\_COMPILE' |
| `ON_COMPRESSION` | `"ON_COMPRESSION"` | 'ON\_COMPRESSION' |
| `ON_CONFIG` | `"ON_CONFIG"` | 'ON\_CONFIG' |
| `ON_DENO_COMPILE` | `"ON_DENO_COMPILE"` | 'ON\_DENO\_COMPILE' |
| `ON_ESBUILD` | `"ON_ESBUILD"` | 'ON\_ESBUILD' |
| `ON_NCC` | `"ON_NCC"` | 'ON\_NCC' |
| `ON_PKG` | `"ON_PKG"` | 'ON\_PKG' |
| `PLATFORM_UNKWON` | `"PLATFORM_UNKWON"` | 'PLATFORM\_UNKWON' |
| `PROCESS_NODE` | `"PROCESS_NODE"` | 'PROCESS\_NODE' |
| `RUNTIME_BUN` | `"RUNTIME_BUN"` | 'RUNTIME\_BUN' |
| `RUNTIME_DENO` | `"RUNTIME_DENO"` | 'RUNTIME\_DENO' |
| `RUNTIME_NODE` | `"RUNTIME_NODE"` | 'RUNTIME\_NODE' |
| `RUNTIME_UNKNOWN` | `"RUNTIME_UNKNOWN"` | 'RUNTIME\_UNKNOWN' |
| `UNEXPECTED` | `"UNEXPECTED"` | 'UNEXPECTED' |
