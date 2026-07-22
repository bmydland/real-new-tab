import { Button } from "@digdir/designsystemet-react";
import styled from "styled-components";
import type { TileSize } from "~/settings";
import { getReadableTileTextColor } from "~/utils/color";

const DELAY_BUTTON_REVEAL = "0.75s" as const;

export const StyledCloseButton = styled(Button)`
  float: inline-end;
  align-items: center;
  margin: 0;
`;

export const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(112px, 150px);
  gap: var(--space-4);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);

  .ds-field[data-variant="outline"] {
    position: relative;
  }

  /* Workaround to get whole element clickable */
  .ds-field[data-variant="outline"] > label::after {
    position: absolute;
    content: "";
    inset: 0;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const FileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
`;

export const IconColorControls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(112px, 150px);
  align-items: end;
  gap: var(--space-4);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: var(--space-2);
`;

export const IconPreview = styled.img`
  width: 38px;
  height: 38px;
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-border-radius-sm);
  object-fit: contain;
  background: var(--ds-color-surface-tinted);
`;

export const IconPreviewFrame = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-border-radius-sm);
  background: var(--ds-color-surface-tinted);
`;

export const MaskedIconPreview = styled.span<{
  $icon: string;
  $iconColor: string;
}>`
  width: 32px;
  height: 32px;
  display: block;
  background-color: ${({ $iconColor }) => $iconColor};
  -webkit-mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
  mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
`;

export const RangeLabel = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);

  span {
    font-variant-numeric: tabular-nums;
  }
`;

export const RangeInput = styled.input`
  width: 100%;
  margin: 0;
  cursor: pointer;
`;

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

  @media (max-width: 720px) {
    width: 100%;
    grid-template-rows: none;
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-size), 1fr));
    grid-auto-columns: auto;
    grid-auto-rows: var(--tile-size);
    grid-auto-flow: row dense;
  }

  @media (max-width: 360px) {
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
  $size: TileSize;
}>`
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  grid-column: ${({ $size }) => ($size === "normal" ? "span 1" : "span 2")};
  grid-row: ${({ $size }) => ($size === "large" ? "span 2" : "span 1")};
  color: ${({ $color }) => getReadableTileTextColor($color)};
  background: ${({ $color }) => $color};
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  opacity: ${({ $isDragging }) => ($isDragging ? 0.44 : 1)};
  outline: ${({ $isDropTarget }) =>
    $isDropTarget ? "3px solid rgba(255, 255, 255, 0.72)" : "0"};
  outline-offset: -3px;
  transition:
    opacity 120ms ease,
    outline-color 120ms ease;

  &:hover button,
  &:focus-within button {
    opacity: 1;
    transition-delay: ${DELAY_BUTTON_REVEAL};
  }

  @media (max-width: 360px) {
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

export const TileLink = styled.a`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  width: 100%;
`;

export const TileIcon = styled.img<{ $iconSize: number }>`
  width: ${({ $iconSize }) => `${$iconSize}%`};
  max-height: 100%;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.1));
`;

export const TileIconMask = styled.span<{
  $icon: string;
  $iconColor: string;
  $iconSize: number;
}>`
  width: ${({ $iconSize }) => `${$iconSize}%`};
  height: ${({ $iconSize }) => `${$iconSize}%`};
  max-width: 100%;
  max-height: 100%;
  display: block;
  flex: none;
  background-color: ${({ $iconColor }) => $iconColor};
  -webkit-mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
  mask: url(${({ $icon }) => $icon}) center / contain no-repeat;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.1));
`;

export const TileDragHandle = styled.button`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 4px;
  padding: 0;
  color: #121918;
  background: rgba(255, 255, 255, 0.86);
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s ease;

  &::before {
    content: "";
    width: 16px;
    height: 16px;
    background-image: radial-gradient(currentColor 1.4px, transparent 1.6px);
    background-size: 6px 6px;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const TileActions = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  display: flex;
  gap: 6px;
`;

export const TileActionButton = styled(Button)`
  min-height: 28px;
  min-width: unset;
  background: rgba(255, 255, 255, 0.85);
  color: black;
  padding: 0;
  padding-inline: 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const EmptyState = styled.button`
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 18px 22px;
  color: var(--color-light);
  background: rgba(6, 12, 14, 0.62);
  font-weight: 700;
  backdrop-filter: blur(12px);
  cursor: pointer;
`;
