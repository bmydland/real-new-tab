import { Button } from "@digdir/designsystemet-react";
import styled from "styled-components";
import type { TileSize } from "~/settings";
import { getReadableTileTextColor } from "~/utils/color";

export const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
`;

export const FormStack = styled.form`
  display: grid;
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

export const TileStage = styled.section`
  display: grid;
  place-items: center;
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
    grid-template-columns: repeat(4, var(--tile-size));
    grid-template-rows: none;
    grid-auto-columns: auto;
    grid-auto-rows: var(--tile-size);
    grid-auto-flow: row dense;
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(3, var(--tile-size));
  }

  @media (max-width: 320px) {
    grid-template-columns: repeat(2, var(--tile-size));
  }
`;

export const TileFrame = styled.article<{
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
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 2px;
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

export const TileIcon = styled.img`
  width: min(64%, 90px);
  display: inline;
  object-fit: contain;
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
  transition: opacity 140ms ease;

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

  ${TileFrame}:hover &,
  ${TileFrame}:focus-within & {
    opacity: 1;
  }
`;

export const TileActions = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 140ms ease;

  ${TileFrame}:hover &,
  ${TileFrame}:focus-within & {
    opacity: 1;
  }
`;

export const TileActionButton = styled(Button)`
  min-height: 28px;
  min-width: unset;
  background: rgba(255, 255, 255, 0.85);
  color: black;
  padding: 0;
  padding-inline: 3px;
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
