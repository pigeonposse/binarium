# Binarium - Build node binaries with zero config

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com?popup=about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/?popup=donate)
[![Github](https://img.shields.io/badge/Github-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pigeonposse)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@pigeonposse)

[![License](https://img.shields.io/github/license/pigeonposse/binarium?color=green&style=for-the-badge&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/binarium?color=blue&style=for-the-badge&label=Version)](https://www.npmjs.com/package/binarium)

Zero-configuration node library and CLI for building executables for all platforms and architectures.

## Index

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [📖 Description](#-description)
- [🔑 Installation](#-installation)
- [📈 usage](#-usage)
  - [Node example](#node-example)
  - [CLI example](#cli-example)
  - [Options](#options)
  - [Config File](#config-file)
    - [Example](#example)
- [👨‍💻 Development](#-development)
- [☕ Donate](#-donate)
- [📜 License](#-license)
- [🐦 About us](#-about-us)
  - [Collaborators](#collaborators)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 📖 Description

Package your Node.js project into an executable that can be run even on devices without Node.js installed.

The construction of the binary allows compilation on `arm` and `x64` architecture.

> If you compile on an `x64` system it will not create the binaries for `arm`, but if you compile on `arm` it will create the binaries for both architectures.

This library works thanks to [ncc](https://github.com/vercel/ncc), [pkg](https://github.com/yao-pkg/pkg) and [esbuild](https://esbuild.github.io), which facilitate this process.

Using  *binarium* is simple and will work in most cases, but that may not be the case. If so, we recommend using other alternatives such as [pkg](https://github.com/yao-pkg/pkg).

## 🔑 Installation

```bash
npm install binarium
# or pnpm
pnpm add binarium
# or yarn
yarn add binarium
```

## 📈 usage

### Node example

```js
import { build } from 'binarium'

await build( {
 input  : 'src/cli.js', // JS or TS file
 name   : 'app-name', // default is input filename
} )
```

### CLI example

```bash
binarium --input=src/server.js --name=app-name
```

### Options

All of these options are available with the `binarium` command by adding the suffix `--` and followed by an `=` and its value.

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
  * The build type Result [all|cjs|bin].
  *
  * @default 'all'
  */
 type?: 'all'|'cjs'|'bin'
  /**
  * Config file path.
  * 
  * @default undefined
  */
 config?: string
}
```

### Config File

For more advanced configuration you can use a configuration file.
Supported formats are: `.mjs, .js, .json, .yml, .yaml, .toml, .tml`.

In the configuration file you can define your build options and configure advanced options of the build itself using the `options` key.

> The `options` configuration is only recommended for cases that require a more advanced configuration.

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
 options : { esbuild: { tsconfig: './tsconfig.builder.json' } },
} )

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
