## Vawe

Desktop audio player (basically a replacement for [Deepseen](https://github.com/peterdee/deepseen-desktop))

### Deploy

```shell script
git clone https://github.com/peterdee/vawe
cd ./vawe
nvm use 22
npm ci
```

### `ffprobe` binaries

This project requires `ffprobe` binaries (`ffprobe` is used to load additional audio information)

1. Download `ffprobe` binary for your OS from here: https://ffbinaries.com/downloads

2. Create `bin` directory in the root of the project

3. Create `{platform}` directory in `bin` (platform name should be the same as `os.platform()`)

4. Unzip downloaded binary and place it into the `bin/{platform}` directory

Example path to the `ffprobe` binary for Mac:

```text
{project_root}/bin/darwin/ffprobe
```

### Launch

```shell script
npm run dev
```

### Template

This project is based on `electron-vite-react` template: https://github.com/electron-vite/electron-vite-react

### License

[MIT](./LICENSE.md)
