import { Textfield } from "@digdir/designsystemet-react";
import styled from "styled-components";

export const SettingsStack = styled.div`
  display: grid;
  gap: var(--space-5);
`;

export const SettingsSection = styled.section`
  display: grid;
  gap: var(--space-3);
`;

export const SettingsActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

export const ToolbarRevealOptions = styled.div`
  display: grid;
  gap: var(--space-2);
`;

export const ToolbarRevealKeyField = styled(Textfield)`
  max-width: 20rem;
`;
