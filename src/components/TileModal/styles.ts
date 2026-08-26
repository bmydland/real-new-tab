import styled from "styled-components";

export const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

export const HorizontalStack = styled.div`
  display: flex;
  width: 100%;
  align-items: end;
  gap: var(--space-4);

  > * {
    flex: 1 1 0;
    min-width: 0;
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;

    > * {
      flex-basis: auto;
      width: 100%;
    }
  }
`;

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);

  .ds-field[data-variant="outline"] {
    position: relative;
  }

  /* Workaround to make the entire option clickable. */
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

export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

export const IconPreview = styled.img`
  width: 38px;
  height: 38px;
  border: var(--border-width) solid var(--ds-color-border-subtle);
  border-radius: var(--ds-border-radius-sm);
  object-fit: contain;
  background: var(--ds-color-surface-tinted);
`;

export const IconPreviewFrame = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: var(--border-width) solid var(--ds-color-border-subtle);
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
