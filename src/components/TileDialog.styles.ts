import { Dialog } from "@digdir/designsystemet-react";
import styled from "styled-components";

export const StyledDialog = styled(Dialog)`
  width: min(560px, calc(100vw - 24px));
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--rnt-space-4);
`;

export const FormStack = styled.form`
  display: grid;
  gap: var(--rnt-space-4);
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(112px, 150px);
  gap: var(--rnt-space-4);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--rnt-space-2);

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const FileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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

export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--rnt-space-2);
`;

export const IconPreview = styled.img`
  width: 38px;
  height: 38px;
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-border-radius-sm);
  object-fit: contain;
  background: var(--ds-color-surface-tinted);
`;
