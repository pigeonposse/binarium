---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
hero:
  name: "BINARIUM"
  text: "zero-config tool to create executables."
  tagline: Easy-to-use, zero-configuration tool to create executables of your Node, Deno or Bun projects for all platforms and architectures.
  image:
    src: /logo.png
    alt: binarium
  actions:
    - theme: brand
      text: Get started
      link: /guide
    - theme: alt
      text: View on GitHub
      link: https://github.com/pigeonposse/binarium

features:

  - title: Get started
    icon: 👋
    details: build your binary now
    link: guide/
  - title: documentation 
    icon: 📚
    details: Read the documentation.
    link: guide/core
  - title: GitHub Action
    icon: 🤖
    details: build your binary using a GitHub Action
    link: guide/action
  - title: Api documentation 
    icon: 📖
    details: Api documentation.
    link: guide/core/api

---

::: code-group

```bash [npm]
npm install binarium
```

```bash [pnpm]
pnpm install binarium
```

```bash [yarn]
yarn add binarium
```

:::
