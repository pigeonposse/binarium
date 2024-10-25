# Binarium - Create executables of your projects with zero config

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

[![License](https://img.shields.io/github/license/pigeonposse/binarium?color=green&style=for-the-badge&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/binarium?color=blue&style=for-the-badge&label=Version)](https://www.npmjs.com/package/binarium)

Easy-to-use, zero-configuration tool to create executables of your `Node`, `Deno` or `Bun` projects for all platforms and architectures.

The construction of the binary allows compilation on `arm` and `x64` architecture.

> If you compile on an `x64` system it will not create the binaries for `arm`, but if you compile on `arm` it will create the binaries for both architectures.

## Index

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [🌟 Features](#-features)
- [🔑 Installation](#-installation)
- [Options](#options)
- [📈 usage](#-usage)
  - [📦 JS](#-js)
  - [🟢 Node](#-node)
  - [🦕 Deno](#-deno)
  - [🍞 Bun](#-bun)
  - [💻 CLI](#-cli)
  - [With config File](#with-config-file)
    - [Example](#example)
  - [🤖 Github Action](#-github-action)
    - [Inputs](#inputs)
    - [Examples](#examples)
      - [Build only linux executables](#build-only-linux-executables)
      - [Build for all platforms and archs and upload to releases](#build-for-all-platforms-and-archs-and-upload-to-releases)
- [👨‍💻 Development](#-development)
- [☕ Donate](#-donate)
- [📜 License](#-license)
- [🐦 About us](#-about-us)
  - [Collaborators](#collaborators)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🌟 Features

- ⚡ **Fast**: Optimized for quick execution and minimal overhead.
- 🚀 **Easy to Use**: Simple setup with minimal configuration required.
- 🛠️ **Advanced Configuration**: Customize to fit your project's exact needs.
- 🌍 **Available for**:
  - 🟢 **Node.js**
  - 🦕 **Deno**
  - 🍞 **Bun**
- 🌐 **Supports Multiple Environments**:
  - 📦 **JavaScript Library**: Integrates seamlessly into any project.
  - 💻 **Command Line Interface (CLI)**: Works across Node.js, Deno, and Bun environments.
  - 🤖 **GitHub Action**: Easily incorporate it into CI/CD pipelines with GitHub Actions support.

## 🔑 Installation

```bash
npm install binarium
# or pnpm
pnpm add binarium
# or yarn
yarn add binarium
```

## Options

All of these options are available with the `binarium` command by adding the suffix `--` and followed by an `=` or space and its value.

For more info execute:

```bash
binarium --help
```

```ts
type BuilderParams = {
 /**
  * The app server input file.
  *
  * The input can be provided without an extension. 
  * If the extension is omitted, the system will automatically look for the following extensions: `.ts`, `.js`, `.mjs`, `.mts`.
  */
 input: string, 
 /**
  * Binary name.
  */
 name?: string,
 /**
  * Directory for the output build.
  *
  * @default './build'
  */
 outDir?: string, 
 /**
  * Build only binary for your current OS.
  *
  * @default false
  */
 onlyOs?: boolean
 /**
  * The build type Result [all|bundle|bin|compress].
  *
  * @default 'all'
  */
 type?: 'all'|'bundle'|'bin'|'compress'
  /**
  * Config file path.
  * 
  * @default undefined
  */
 config?: string
}
```

## 📈 usage

Below is a sample of the many ways to run `binarium`.

### 📦 JS

Quickly compile your JS project into executables for all platforms and architectures

> Automatically detects the JS runtime you are working in. Only accepts `node`, `deno`, `bun`

```js
import { build } from 'binarium'

await build( {
 input  : 'src/cli.js', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

### 🟢 Node

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

### 🦕 Deno

Build Deno executables (`deno compile` wrapper)

```js
import { buildDeno } from 'binarium'

await buildDeno( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

### 🍞 Bun

Build Bun executables (`bun build --compile` wrapper)

```js
import { buildBun } from 'binarium'

await buildBun( {
 input  : 'src/cli', // JS or TS file. You can add it without the extension
 name   : 'app-name', // default is input filename
} )
```

### 💻 CLI

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

### With config File

For more advanced configuration you can use a configuration file.
Supported formats are: `.mjs, .js, .json, .yml, .yaml, .toml, .tml`.

In the configuration file you can define your build options and configure advanced options of the build itself using the `nodeOptions` key.

> The `nodeOptions` configuration is only recommended for cases that require a more advanced configuration.

#### Example

```bash
binarium  --config=binarium.config.js
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

### 🤖 Github Action

#### Inputs

The action accepts the following inputs:

- **build** (optional): Specifies the execution environment. Acceptable values are: `node`, `deno`, `bun`. The default is `node`.

- **config** (optional): Path to the configuration file. The default is `./binarium.config.json`.
Make sure that the specified configuration file exists and is correctly configured.

#### Examples

Here is an example of how to set it up:

##### Build only linux executables

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
# @see https://github.com/pigeonposse/binarium?tab=readme-ov-file#config-file
name: my-app
onlyOs: true
input: src/app.ts
assets:
  - from: src/assets/**
    to: public

```

##### Build for all platforms and archs and upload to releases

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
# @see https://github.com/pigeonposse/binarium?tab=readme-ov-file#config-file
name: my-app
input: src/app.ts

```

## 👨‍💻 Development

**binarium** is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/pigeonposse/binarium/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)](https://github.com/pigeonposse/binarium/pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)](https://binarium.pigeonposse.com/)

## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/?popup=donate)

## 📜 License

This software is licensed with **[GPL-3.0](/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](/LICENSE)

## 🐦 About us

*PigeonPosse* is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)

### Collaborators

|                                                                                    | Name        | Role         | GitHub                                         |
| ---------------------------------------------------------------------------------- | ----------- | ------------ | ---------------------------------------------- |
| <img src="https://github.com/angelespejo.png?size=72" alt="Angelo" style="border-radius:100%"/> | Angelo |   Author & Development   | [@Angelo](https://github.com/angelespejo) |
| <img src="https://github.com/PigeonPosse.png?size=72" alt="PigeonPosse" style="border-radius:100%"/> | PigeonPosse | Collective | [@PigeonPosse](https://github.com/PigeonPosse) |

<br>
<p align="center">

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

</p>
