## Vawe

Desktop audio player (basically a replacement for [Deepseen](https://github.com/peterdee/deepseen-desktop))

### Deploy

```shell script
git clone https://github.com/peterdee/vawe
cd ./vawe
nvm use 22
npm ci
```

### Launch

```shell script
npm run dev
```

<!--
## 🚨 Be aware

This template integrates Node.js API to the renderer process by default. If you want to follow **Electron Security Concerns** you might want to disable this feature. You will have to expose needed API by yourself.  

To get started, remove the option as shown below. This will [modify the Vite configuration and disable this feature](https://github.com/electron-vite/vite-plugin-electron-renderer#config-presets-opinionated).

```diff
# vite.config.ts

export default {
  plugins: [
    ...
-   // Use Node.js API in the Renderer-process
-   renderer({
-     nodeIntegration: true,
-   }),
    ...
  ],
}
```
-->

### Template

This project is based on `electron-vite-react` template: https://github.com/electron-vite/electron-vite-react

### License

[MIT](./LICENSE.md)
