# Changelog

All notable changes to realNewTab will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project uses semantic versioning.

## [0.1.13] - 30.08.2026

### Added

- Added a setting to reveal the toolbar on hover or with a configurable keypress.

### Changed

- Limited the toolbar hover target to the area around its buttons.

### Fixed

- Display settings notifications above the modal backdrop.

## [0.1.12] - 26.08.2026

### Changed

- Change html title to "New tab"
- Made edit mode presist
- Changed footer button position insider in edit/create modal

## [0.1.11] - 10.08.2026

### Added

- Added a tile-size adjustment setting for tuning the layout across different screens and machines.

### Changed

- Kept tile-size adjustments smooth by separating the live CSS preview from debounced settings persistence.
- Reorganized shared and feature-specific styles into reusable, colocated components.

## [0.1.10] - 04.08.2026

### Fixed

- Automatically close edit modal when deleting tile

## [0.1.9] - 03.08.2026

### Added

- Added support for tile icon sizes up to 200%.

### Changed

- Improved the clarity and styling of modal and toolbar buttons.
- Refactored related toolbar and tile UI code.

## [0.1.8] - 26.07.2026

### Added

- Added an explicit edit mode for managing and reordering tiles.

### Changed

- Made the entire tile draggable in edit mode instead of using a separate drag handle.
- Show tile actions only in edit mode, hide them while dragging, and use larger centered controls with clearer hover feedback and improved shadows.
- Keep the toolbar visible while edit mode is active.
- Moved status notifications to the bottom-left corner.

## [0.1.7] - 23.07.2026

### Changed

- Improved icon scaling consistency: square tiles now scale icons by both width and height, while wide tiles scale icons by height only.

## [0.1.6] - 23.07.2026

### Added

- Added a "Match tile color" action for new and existing tiles that matches the tile background to the icon's edge color.

### Changed

- Reorganized the tile configuration controls into a clearer, responsive hierarchy.
- Show custom icon color controls only for SVG icons.
- Display tile form errors in an alert.
- Removed raster icon shadows so matched icon backgrounds blend seamlessly into tiles.

## [0.1.5] - 23.07.2026

### Changed

- Size tile icons relative to tile height for consistent sizing across square and wide tiles.

## [0.1.4] - 22.07.2026

### Added

- Added optional custom colors for SVG tile icons.

### Changed

- Clarified that full backups include settings, tiles, background images, and tile icons.
- Added local hours, minutes, and seconds to exported backup filenames.
- Use versioned changelog entries as the source for GitHub release notes.

## [0.1.3] - 22.07.2026

### Changed

- Improved the information shown for importing and exporting settings.

## [0.1.2] - 22.07.2026

### Added

- Added automated GitHub release packaging and installation documentation.

[0.1.12]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.12
[0.1.11]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.11
[0.1.10]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.10
[0.1.9]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.9
[0.1.8]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.8
[0.1.7]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.7
[0.1.6]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.6
[0.1.5]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.5
[0.1.4]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.4
[0.1.3]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.3
[0.1.2]: https://github.com/bmydland/real-new-tab/releases/tag/v0.1.2
