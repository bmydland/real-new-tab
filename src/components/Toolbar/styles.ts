import { Button } from "@digdir/designsystemet-react";
import styled, { css } from "styled-components";

export const StyledHeader = styled.header<{ $isEditMode: boolean }>`
  position: sticky;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-self: flex-end;
  gap: 4px;
  height: 0;
  opacity: ${({ $isEditMode }) => ($isEditMode ? 1 : 0)};
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
