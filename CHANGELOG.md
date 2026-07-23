# Changelog

All notable changes to realNewTab will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project uses semantic versioning.

## [Unreleased]

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

[Unreleased]: https://github.com/bmydland/realNewTab/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/bmydland/realNewTab/releases/tag/v0.1.5
[0.1.4]: https://github.com/bmydland/realNewTab/releases/tag/v0.1.4
[0.1.3]: https://github.com/bmydland/realNewTab/releases/tag/v0.1.3
[0.1.2]: https://github.com/bmydland/realNewTab/releases/tag/v0.1.2
