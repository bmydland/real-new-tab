import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";
import type { BackgroundPosition } from "~/settings";

export const Toolbar = styled.header`
  position: sticky;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-self: flex-end;
  gap: 4px;
  height: 0;

  opacity: 0;
  transition: opacity 0.5s ease;
  transition-delay: 0.5s;

  &:hover {
    opacity: 1;
    transition-delay: 0s;
  }

  @media (max-width: 700px) {
    height: auto;
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

export const ToolbarButton = styled(Button)<{ icon?: boolean }>`
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 100px;
  color: var(--color-light);
  background-color: rgba(10, 15, 15, 0.62);
  transition: background-color 0.4s ease;
  font-size: 0.82rem;
  backdrop-filter: blur(12px);

  ${({ icon }) =>
    icon &&
    css`
      padding: 0;
    `};

  &:hover {
    background-color: rgba(10, 15, 15, 0.78);
  }
`;

export const StyledMain = styled.main<{
  $backgroundColor: string;
  $backgroundImage?: string;
  $backgroundPosition: BackgroundPosition;
}>`
  min-height: 100dvh;
  padding-block: 15px;
  padding-inline: var(--tile-gap);
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage && `url(${$backgroundImage})`};
  background-position: ${({ $backgroundPosition }) => $backgroundPosition};
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;

  @media (max-width: 720px) {
    gap: 20px;
  }
`;
