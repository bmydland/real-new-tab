import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";

export const StyledMain = styled.main<{
  $backgroundColor: string;
  $backgroundImage?: string;
}>`
  min-height: 100dvh;
  padding-block: 80px;
  padding-inline: var(--tile-gap);
  width: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage && `url(${$backgroundImage})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
`;

export const Toolbar = styled.header`
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 10;
  display: flex;
  gap: 8px;

  @media (max-width: 500px) {
    position: relative;
    flex-wrap: wrap;
    inset: 0;
    width: 100%;
    margin: 15px 15px 50px 15px;
    padding-inline: 10px;

    > button {
      flex: 1;
      width: 100%;
      min-width: fit-content;
    }
  }
`;

export const ToolbarButton = styled(Button)<{ icon?: boolean }>`
  min-width: 44px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 100px;
  padding: 0 14px;
  color: var(--color-light);
  background: rgba(10, 15, 15, 0.62);
  font-size: 0.82rem;
  backdrop-filter: blur(12px);

  ${({ icon }) =>
    icon &&
    css`
      padding: 0;
    `};

  &:hover {
    background: rgba(10, 15, 15, 0.78);
  }
`;
