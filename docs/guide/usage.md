# 📈 usage

Below is a sample of the many ways to run `binarium`.

## 📦 JS

Quickly compile your JS project into executables for all platforms and architectures

> Automatically detects the JS runtime you are working in. Only accepts `node`, `deno`, `bun`

```js
import { build } from 'binarium'

await build( {
 input  : 'src/cli.js', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

## 🟢 Node

Quickly compile your `Node` project into executables for all platforms and architectures

```js
import { buildNode } from 'binarium'

await buildNode( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

> This function works thanks to [ncc](https://github.com/vercel/ncc), [pkg](https://github.com/yao-pkg/pkg) and [esbuild](https://esbuild.github.io), which facilitate this process.

Alternatively, if you are working in a node environment, you can do:

```js
import { build } from 'binarium'

await build( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

## 🦕 Deno

Build Deno executables (`deno compile` wrapper)

```js
import { buildDeno } from 'binarium'

await buildDeno( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

## 🍞 Bun

Build Bun executables (`bun build --compile` wrapper)

```js
import { buildBun } from 'binarium'

await buildBun( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

## 💻 CLI

Use it from Cli.

```bash
binarium --input src/server.js --name app-name
```

```bash
binarium node --input src/node-server.js --name node-app-name
```

```bash
binarium deno --input src/deno-server.js --name deno-app-name
```

```bash
binarium bun --input src/bun-server.js --name bun-app-name
```

## 🛠️ With config file - advanced configuration

For more advanced configuration you can use a configuration file.
Supported formats are: `.mjs, .js, .json, .yml, .yaml, .toml, .tml`.

In the configuration file you can define your build options and configure advanced options of the build itself using the `nodeOptions`|`denoOptions`|`bunOptions` key.

## Node Example

```bash
binarium node --config binarium.config.js
```

```js
// binarium.config.js
import { defineConfig } from 'binarium'

export default defineConfig( {
 name    : 'my-app-name',
 onlyOs  : true,
 nodeOptions : { esbuild: { tsconfig: './tsconfig.builder.json' } },
} )

```

## Deno Example

```bash
binarium deno -c binarium.config.js
```

```js
// binarium.config.js
import { defineConfig } from 'binarium'

export default defineConfig( {
 name    : 'my-app-name',
 onlyOs  : true,
 denoOptions : { flags: [ '--allow-all', '--no-npm' ] },
} )

```

## Bun Example

```bash
binarium bun -c binarium.config.js
```

```js
// binarium.config.js
import { defineConfig } from 'binarium'

export default defineConfig( {
 name    : 'my-app-name',
 onlyOs  : true,
 bunOptions : { flags: [ '--packages external' ] },
} )

```

## 🤖 Github Action

## Inputs

The action accepts the following inputs:

- **build** (optional): Specifies the execution environment. Acceptable values are: `node`, `deno`, `bun`. The default is `node`.

- **config** (optional): Path to the configuration file. The default is `./binarium.config.json`.
Make sure that the specified configuration file exists and is correctly configured.

## Examples

Here is an example of how to set it up:

### Build only linux executables

```yaml
name: Build Executable for linux

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Run BINARIUM Action
        uses: pigeonposse/binarium@v1
        with:
          build: 'node'
          config: '.dev/binarium.config.yml'
```

```yaml
# .dev/binarium.config.yml
name: my-app
onlyOs: true
input: src/app.ts
assets:
  - from: src/assets/**
    to: public

```

### Build for all platforms and archs and upload to releases

```yaml
name: Build Executables and upload

on:
  workflow_dispatch:
jobs:
  build:
    runs-on: macos-14 # Because it's an arm64. SEE: https://github.com/actions/runner-images?tab=readme-ov-file#available-images
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Run BINARIUM Action
        uses: pigeonposse/binarium@v1
        with:
          build: 'node'
          config: './binarium.config.yml' # Where is our config file
      - name: Release binaries
        uses: ncipollo/release-action@v1
        with:
          tag: "Releases"
          draft: false
          prerelease: false
          allowUpdates: true
          artifacts: "build/compress/*" # Default build folder
          omitBodyDuringUpdate: true
```

```yaml
# ./binarium.config.yml
name: my-app
input: src/app.ts

```
