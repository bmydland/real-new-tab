# Changelog

All notable changes to realNewTab will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project uses semantic versioning.

## [0.1.8] - 2026-07-26

### Added

- Added an explicit edit mode for managing and reordering tiles.

### Changed

- Made the entire tile draggable in edit mode instead of using a separate drag handle.
- Show tile actions only in edit mode, hide them while dragging, and use larger centered controls with clearer hover feedback and improved shadows.
- Keep the toolbar visible while edit mode is active.
- Moved status notifications to the bottom-left corner.

## [0.1.7] - 2026-07-23

### Changed

- Improved icon scaling consistency: square tiles now scale icons by both width and height, while wide tiles scale icons by height only.

## [0.1.6] - 2026-07-23

### Added

- Added a "Match tile color" action for new and existing tiles that matches the tile background to the icon's edge color.

### Changed

- Reorganized the tile configuration controls into a clearer, responsive hierarchy.
- Show custom icon color controls only for SVG icons.
- Display tile form errors in an alert.
- Removed raster icon shadows so matched icon backgrounds blend seamlessly into tiles.

## [0.1.5] - 2026-07-23

### Changed

- Size tile icons relative to tile height for consistent sizing across square and wide tiles.

## [0.1.4] - 2026-07-22

### Added

- Added optional custom colors for SVG tile icons.

### Changed

- Clarified that full backups include settings, tiles, background images, and tile icons.
- Added local hours, minutes, and seconds to exported backup filenames.
- Use versioned changelog entries as the source for GitHub release notes.

## [0.1.3] - 2026-07-22

### Changed

- Improved the information shown for importing and exporting settings.

## [0.1.2] - 2026-07-22

### Added

- Added automated GitHub release packaging and installation documentation.

[Unreleased]: https://github.com/bmydland/real-new-tab/compare/v0.1.8...HEAD
[0.1.8]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.8
[0.1.7]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.7
[0.1.6]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.6
[0.1.5]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.5
[0.1.4]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.4
[0.1.3]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.3
[0.1.2]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.2
