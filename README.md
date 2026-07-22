# realNewTab

A local Chrome new-tab extension built with React, Vite, and Manifest V3.

## Usage

Download the latest packaged extension from the [GitHub Releases page](https://github.com/bmydland/realNewTab/releases/latest).

1. Open the latest release and download `realNewTab-vX.Y.Z.zip` under **Assets**.
2. Extract the ZIP file to a permanent location on your computer.
3. Open `chrome://extensions` in Google Chrome.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `realNewTab/` folder containing `manifest.json`.

Chrome cannot load the ZIP file directly. Keep the extracted folder after loading the extension; Chrome uses the files from that location.

## Development

Install dependencies:

```bash
npm ci
```

### Run Locally

Run the app on localhost while building the UI:

```bash
npm run dev
```

When running on localhost, Chrome extension APIs are not available. The installed extension build uses Chrome extension storage.

### Build

Create the extension bundle:

```bash
npm run build
```

Vite writes the Chrome extension files to `dist/`. That folder is the extension build.

### Load A Development Build In Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `dist/` folder.

### Verify

```bash
npm run lint
npm run build
```

### Create A Release

GitHub Actions creates a release whenever a version tag beginning with `v` is pushed. Use a numeric Chrome-compatible version such as `v0.1.0`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The release workflow:

1. Installs dependencies with `npm ci`.
2. Runs lint and builds the extension.
3. Uses the tag version for `manifest.json` in the packaged build.
4. Packages the build as `realNewTab-v0.1.0.zip`, containing a `realNewTab/` extension folder.
5. Publishes the ZIP on the [GitHub Releases page](https://github.com/bmydland/realNewTab/releases).

Increment the tag for each release, for example `v0.1.1` and then `v0.2.0`. Release tags must contain one to four numeric components and cannot contain prerelease suffixes.
