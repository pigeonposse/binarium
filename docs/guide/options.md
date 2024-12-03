# ⚙️ Options

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
 output?: string,
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
