import { DialogBlock } from "@digdir/designsystemet-react";
import type { ReactNode } from "react";
import styled from "styled-components";

const StyledDialogBlock = styled(DialogBlock)`
  position: sticky;
  bottom: 0;
  margin-top: auto;
  background-color: var(--color-light);
`;

export function StickyFooter({ children }: { children: ReactNode }) {
  return <StyledDialogBlock>{children}</StyledDialogBlock>;
}
