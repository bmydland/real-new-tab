import type { PropsWithChildren } from "react";
import styled from "styled-components";

export function AppTheme({ children }: PropsWithChildren) {
  return (
    <ThemeRoot data-color="brand1" data-color-scheme="light" data-size="md" data-typography="primary">
      {children}
    </ThemeRoot>
  );
}

const ThemeRoot = styled.div`
  min-height: 100%;
`;
