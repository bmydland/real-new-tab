import styled from "styled-components";
import { getReadableTileTextColor, translucentBlack } from "./utils/color";
import type { TileSize } from "./settings";

export const NewTabShell = styled.main<{ $backgroundColor: string; $backgroundImage?: string }>`
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 56px 24px;
  overflow: hidden;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `linear-gradient(${translucentBlack(0.2)}, ${translucentBlack(0.36)}), url(${$backgroundImage})`
      : "radial-gradient(circle at 22% 18%, rgba(11, 127, 127, 0.34), transparent 34%), linear-gradient(135deg, #13201d, #09100f 66%)"};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  @media (max-width: 720px) {
    padding-inline: 12px;
  }
`;

export const Toolbar = styled.div`
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

export const ToolbarButton = styled.button<{ $isText?: boolean }>`
  min-width: ${({ $isText }) => ($isText ? "auto" : "44px")};
  width: ${({ $isText }) => ($isText ? "auto" : "44px")};
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: ${({ $isText }) => ($isText ? "0 14px" : "0")};
  color: #ffffff;
  background: rgba(10, 15, 15, 0.62);
  font-size: ${({ $isText }) => ($isText ? "0.82rem" : "1.8rem")};
  font-weight: 800;
  line-height: 1;
  text-transform: ${({ $isText }) => ($isText ? "uppercase" : "none")};
  backdrop-filter: blur(12px);
  cursor: pointer;

  &:hover {
    background: rgba(10, 15, 15, 0.78);
  }
`;

export const TileStage = styled.section`
  width: min(100%, 1060px);
  display: grid;
  place-items: center;
`;

export const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, var(--rnt-tile-size));
  grid-auto-rows: var(--rnt-tile-size);
  grid-auto-flow: dense;
  justify-content: center;
  gap: var(--rnt-tile-gap);
  max-width: 100%;

  @media (max-width: 980px) {
    grid-template-columns: repeat(6, var(--rnt-tile-size));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(4, var(--rnt-tile-size));
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(3, var(--rnt-tile-size));
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
  outline: ${({ $isDropTarget }) => ($isDropTarget ? "3px solid rgba(255, 255, 255, 0.72)" : "0")};
  outline-offset: -3px;
  transition:
    opacity 120ms ease,
    outline-color 120ms ease;
`;

export const TileLink = styled.a`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: center;
  padding: 12px;
  color: inherit;
  text-decoration: none;
`;

export const TileIcon = styled.img`
  width: min(64%, 92px);
  max-height: 64%;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
`;

export const TileInitial = styled.span`
  display: grid;
  place-items: center;
  width: 62%;
  aspect-ratio: 1;
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 800;
  line-height: 1;
`;

export const TileLabel = styled.span`
  width: 100%;
  overflow: hidden;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
  text-overflow: ellipsis;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.38);
  white-space: nowrap;
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

export const TileActionButton = styled.button`
  min-height: 28px;
  border: 0;
  border-radius: 4px;
  padding: 0 8px;
  color: #121918;
  background: rgba(255, 255, 255, 0.88);
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;
`;

export const EmptyState = styled.button<{ as?: "p" | "button" }>`
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 18px 22px;
  color: #ffffff;
  background: rgba(6, 12, 14, 0.62);
  font-weight: 700;
  backdrop-filter: blur(12px);
  cursor: pointer;
`;
