import styled from "styled-components";

export const RangeLabel = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);

  span {
    font-variant-numeric: tabular-nums;
  }
`;

export const RangeInput = styled.input`
  width: 100%;
  margin: 0;
  cursor: pointer;
`;
