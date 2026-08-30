import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";
import type { ToolbarRevealMode } from "~/settings";

export const StyledHeader = styled.header<{
  $isVisible: boolean;
  $revealMode: ToolbarRevealMode;
}>`
  position: absolute;
  top: 0;
  padding: var(--tile-gap);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-self: end;
  gap: var(--space-1);
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible, $revealMode }) =>
    $revealMode === "keypress" && !$isVisible ? "none" : "auto"};

  ${({ $revealMode }) =>
    $revealMode === "hover" &&
    css`
      transition: opacity 0.5s ease;
      transition-delay: 0.5s;

      &:hover,
      &:focus-within {
        opacity: 1;
        transition-delay: 0s;
      }
    `}

  @media (max-width: 43.75rem) {
    position: sticky;
    padding: 0;
  }

  @media (max-width: 31.25rem) {
    flex-wrap: wrap;
    inset: 0;
    width: 100%;
    padding-inline: var(--tile-gap);

    > button {
      flex: 1;
      width: 100%;
      min-width: fit-content;
    }
  }
`;

export const ToolbarButton = styled(Button)<{
  icon?: boolean;
  $isEditMode?: boolean;
  $preserveVariant?: boolean;
}>`
  border-radius: var(--ds-border-radius-full);
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.82rem;
  backdrop-filter: blur(var(--backdrop-blur));

  ${({ $isEditMode, $preserveVariant }) =>
    !$preserveVariant
      ? css`
          background-color: ${$isEditMode
            ? "color-mix(in srgb, var(--color-light) 90%, transparent)"
            : "rgba(10, 15, 15, 0.6)"};
          border: var(--border-width) solid rgba(255, 255, 255, 0.22);
          color: ${$isEditMode ? "var(--color-dark)" : "var(--color-light)"};

          &:hover,
          &:focus-visible {
            background-color: ${$isEditMode
              ? "var(--color-light)"
              : "var(--color-dark)"};
          }
        `
      : css`
          filter: drop-shadow(0 0 0.9375rem rgba(0, 0, 0, 0.4));
        `}

  ${({ icon }) =>
    icon &&
    css`
      padding: 0;
    `};
`;
