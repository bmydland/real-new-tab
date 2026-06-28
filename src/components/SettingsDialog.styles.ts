import { Dialog } from "@digdir/designsystemet-react";
import styled from "styled-components";
import type { TileSize } from "../settings";
import { translucentBlack } from "../utils/color";

export const StyledSettingsDialog = styled(Dialog)`
  width: min(820px, calc(100vw - 24px));
`;

export const SettingsPreview = styled.div<{ $backgroundColor: string; $backgroundImage?: string }>`
  min-height: 176px;
  display: grid;
  align-items: center;
  overflow: hidden;
  border-radius: var(--ds-border-radius-sm);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `linear-gradient(${translucentBlack(0.22)}, ${translucentBlack(0.28)}), url(${$backgroundImage})`
      : "linear-gradient(135deg, #13201d, #09100f)"};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 44px);
  grid-auto-rows: 44px;
  grid-auto-flow: dense;
  gap: 6px;
  padding: 24px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, 42px);
    grid-auto-rows: 42px;
    padding: 18px;
  }
`;

export const PreviewTile = styled.span<{ $size: TileSize }>`
  grid-column: ${({ $size }) => ($size === "normal" ? "span 1" : "span 2")};
  grid-row: ${({ $size }) => ($size === "large" ? "span 2" : "span 1")};
  background: rgba(17, 102, 106, 0.82);
`;

export const SettingsStack = styled.div`
  display: grid;
  gap: var(--rnt-space-5);
`;

export const SettingsSection = styled.section`
  display: grid;
  gap: var(--rnt-space-3);
`;

export const SettingsActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--rnt-space-2);
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const SettingsFacts = styled.dl`
  max-width: 420px;
  display: grid;
  gap: 10px;
`;

export const SettingsFact = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--ds-color-border-subtle);
  padding-bottom: 10px;

  dt {
    font-weight: 700;
  }
`;
