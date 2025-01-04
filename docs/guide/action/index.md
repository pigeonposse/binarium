# Github Action 🤖

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
