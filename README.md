# realNewTab

A local Chrome new-tab extension built with React, Vite, and Manifest V3.

## Usage

Download the latest packaged extension from the [GitHub Releases page](https://github.com/bmydland/realNewTab/releases/latest).

1. Open the latest release and download `realNewTab.zip` under **Assets**.
2. Extract the ZIP file to a permanent location on your computer.
3. Open `chrome://extensions` in Google Chrome.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `realNewTab/` folder. It should contain `manifest.json` directly.

Chrome cannot load the ZIP file directly. Keep the extracted folder after loading the extension; Chrome uses the files from that location.

See [CHANGELOG.md](CHANGELOG.md) for the release history.

## Organization-managed New Tab pages

The background service worker watches newly created tabs whose `pendingUrl` is exactly `chrome://newtab/`. It updates that tab to this extension's `index.html` directly, preserving the existing tab and its state. Other URLs are ignored. The normal `chrome_url_overrides` entry remains in place.

The additional `tabs` permission is needed to read `pendingUrl`; no host permissions, content scripts, or policy changes are used. Existing storage permissions and saved settings are unchanged. Vite copies `public/background.js` into `dist/` automatically, including in release archives.

Disable **Override Chrome's New Tab Policy** before testing this build to avoid two extensions replacing the same tab. Build, then reload the existing realNewTab entry at `chrome://extensions` if it points to this repository's `dist/` folder. Approve the added permission if Chrome requests it. If your installed entry points elsewhere, update that folder's build files and reload the same entry to retain its extension identity and settings.

Check Ctrl+T, the + button, a new window, and normal links opened in background tabs. Confirm tiles/settings still work and there are no duplicate tabs. This is a timing-dependent workaround: it only runs when Chrome exposes `chrome://newtab/` in `pendingUrl` at creation. A managed URL opened directly or supplied before this event will not match. The tab keeps its existing ID, and Chrome controls address-bar focus; this is not a guarantee against every enterprise configuration.

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

GitHub Actions creates a release whenever a version tag beginning with `v` is pushed. Before tagging, move the relevant entries from `Unreleased` into a dated `CHANGELOG.md` section matching the version, and commit that change:

```markdown
## [0.1.4] - 2026-07-22
```

Then create and push the corresponding numeric Chrome-compatible tag:

```bash
git tag v0.1.4
git push origin v0.1.4
```

The release workflow:

1. Requires a non-empty matching version section in `CHANGELOG.md`.
2. Installs dependencies with `npm ci`.
3. Runs lint and builds the extension.
4. Uses the tag version for `manifest.json` in the packaged build.
5. Packages the contents of `dist/` as `realNewTab.zip`, with `manifest.json` at the archive root.
6. Publishes the ZIP and version-specific changelog entry on the [GitHub Releases page](https://github.com/bmydland/realNewTab/releases).

Increment the tag for each release, for example `v0.1.1` and then `v0.2.0`. Release tags must contain one to four numeric components and cannot contain prerelease suffixes.
