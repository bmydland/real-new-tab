import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";

export const StyledHeader = styled.header<{ $isEditMode: boolean }>`
  position: absolute;
  top: 0;
  padding: var(--tile-gap);
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: end;
  gap: 4px;
  opacity: ${({ $isEditMode }) => ($isEditMode ? 1 : 0)};
  transition: opacity 0.5s ease;
  transition-delay: 0.5s;

  &:hover {
    opacity: 1;
    transition-delay: 0s;
  }

  @media (max-width: 700px) {
    position: sticky;
    padding: 0;
  }

  @media (max-width: 500px) {
    flex-wrap: wrap;
    inset: 0;
    width: 100%;
    padding-inline: 10px;

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
  border-radius: 100px;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.82rem;
  backdrop-filter: blur(12px);

  ${({ $isEditMode, $preserveVariant }) =>
    !$preserveVariant
      ? css`
          background-color: ${$isEditMode
            ? "color-mix(in srgb, var(--color-light) 90%, transparent)"
            : "rgba(10, 15, 15, 0.6)"};
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: ${$isEditMode ? "var(--color-dark)" : "var(--color-light)"};

          &:hover,
          &:focus-visible {
            background-color: ${$isEditMode
              ? "var(--color-light)"
              : "var(--color-dark)"};
          }
        `
      : css`
          filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.4));
        `}

  ${({ icon }) =>
    icon &&
    css`
      padding: 0;
    `};
`;
