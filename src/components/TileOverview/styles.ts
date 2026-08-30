import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";
import type { TileSize } from "~/settings";
import { TILE_ICON_SIZE_RANGE } from "~/settings/constants";
import { getReadableTileTextColor } from "~/utils/color";

export const TileStage = styled.section`
  display: grid;
  place-items: center;
  flex: 1;
  width: 100%;
`;

export const TileGrid = styled.div<{ $rowCount: number }>`
  display: grid;
  width: fit-content;
  grid-template-rows: ${({ $rowCount }) =>
    `repeat(${$rowCount}, var(--tile-size))`};
  grid-auto-columns: var(--tile-size);
  grid-auto-flow: column dense;
  justify-content: center;
  gap: var(--tile-gap);
  max-width: 100%;

  @media (max-width: 45rem) {
    width: 100%;
    grid-template-rows: none;
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-size), 1fr));
    grid-auto-columns: auto;
    grid-auto-rows: var(--tile-size);
    grid-auto-flow: row dense;
  }

  @media (max-width: 22.5rem) {
    display: flex;
    width: fit-content;
    flex-direction: column;
    align-items: center;
  }
`;

export const TileElement = styled.article<{
  $color: string;
  $isDragging?: boolean;
  $isDropTarget?: boolean;
  $isEditMode: boolean;
  $size: TileSize;
}>`
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  grid-column: ${({ $size }) => ($size === "normal" ? "span 1" : "span 2")};
  grid-row: ${({ $size }) => ($size === "large" ? "span 2" : "span 1")};
  background-color: ${({ $color }) => $color};
  color: ${({ $color }) => getReadableTileTextColor($color)};
  box-shadow: 0 0.75rem 1.75rem rgba(0, 0, 0, 0.22);
  opacity: ${({ $isDragging }) => ($isDragging ? 0.44 : 1)};
  transition: opacity 120ms ease;

  ${({ $isEditMode }) =>
    !$isEditMode
      ? css`
          &:hover {
            outline: var(--border-width) solid var(--color-light);
            outline-offset: calc(var(--border-width) * -1);
          }
        `
      : css`
          outline-offset: -0.375rem;

          &:hover {
            outline: 0.375rem solid rgba(255, 255, 255, 0.72);
          }
        `}

  ${({ $isEditMode }) =>
    $isEditMode &&
    css`
      cursor: grab;

      &:hover {
        outline: 0.375rem solid rgba(255, 255, 255, 0.9);
      }

      &:active {
        cursor: grabbing;
      }
    `}
  @media (max-width: 22.5rem) {
    flex: none;
    width: ${({ $size }) =>
      $size === "normal"
        ? "var(--tile-size)"
        : "calc(var(--tile-size) * 2 + var(--tile-gap))"};
    height: ${({ $size }) =>
      $size === "large"
        ? "calc(var(--tile-size) * 2 + var(--tile-gap))"
        : "var(--tile-size)"};
  }
`;

export const TileLink = styled.a<{ $isEditMode: boolean }>`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  width: 100%;
  pointer-events: ${({ $isEditMode }) => ($isEditMode ? "none" : "auto")};
`;

export const TileIcon = styled.img<{
  $iconSize: number;
}>`
  display: block;
  width: ${({ $iconSize }) => `${$iconSize}%`};
  height: ${({ $iconSize }) => `${$iconSize}%`};
  max-width: ${TILE_ICON_SIZE_RANGE.max}%;
  max-height: ${TILE_ICON_SIZE_RANGE.max}%;
  object-fit: contain;
  flex: none;
`;

export const TileIconMask = styled.span<{
  $icon: string;
  $iconColor: string;
  $iconSize: number;
}>`
  display: block;
  background-color: ${({ $iconColor }) => $iconColor};
  width: ${({ $iconSize }) => `${$iconSize}%`};
  height: ${({ $iconSize }) => `${$iconSize}%`};
  max-width: ${TILE_ICON_SIZE_RANGE.max}%;
  max-height: ${TILE_ICON_SIZE_RANGE.max}%;
  mask-image: url(${({ $icon }) => $icon});
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  flex: none;
`;

export const TileActionButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: end;
  justify-content: end;
  padding: var(--space-3);
  inset: 0;
  z-index: 2;
  gap: 0.375rem;
  filter: drop-shadow(0 0 0.9375rem rgba(0, 0, 0, 0.75));
`;

export const TileActionButton = styled(Button)`
  min-height: var(--btn-size);
  min-width: var(--btn-size);
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.85);
  color: black;
  padding: 0;
  padding-inline: var(--space-1);
  z-index: 10;
`;

export const EmptyState = styled.button`
  min-height: 3rem;
  border: 0;
  border-radius: var(--ds-border-radius-lg);
  padding: 1.125rem 1.375rem;
  color: var(--color-light);
  background: rgba(6, 12, 14, 0.62);
  font-weight: 700;
  backdrop-filter: blur(var(--backdrop-blur));
  cursor: pointer;
`;
