import styled from "styled-components";
import type { BackgroundPosition } from "~/settings";

export const StyledMain = styled.main<{
  $backgroundColor: string;
  $backgroundImage?: string;
  $backgroundPosition: BackgroundPosition;
  $tileSizeScaler: number;
}>`
  --tile-size: calc(
    var(--tile-base-size) * ${({ $tileSizeScaler }) => $tileSizeScaler}
  );

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
