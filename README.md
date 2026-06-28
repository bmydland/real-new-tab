# realNewTab

A local Chrome new-tab extension built with React, Vite, and Manifest V3.

## Development

Run the app on localhost while building the UI:

```bash
npm run dev
```

When running on localhost, Chrome extension APIs are not available. The installed extension build uses Chrome extension storage.

## Build

Create the extension bundle:

```bash
npm run build
```

Vite writes the Chrome extension files to `dist/`. That folder is the extension build.

## Use Locally In Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `dist/` folder.

## Ship To Friends

1. Run `npm run build`.
2. Zip the generated `dist/` folder.
3. Send that zip file.
4. They unzip it and load the unzipped `dist/` folder through `chrome://extensions` -> `Load unpacked`.

Do not zip the source project folder for normal local use. Ship the built `dist/` folder.

## Verify

```bash
npm run lint
npm run build
```
