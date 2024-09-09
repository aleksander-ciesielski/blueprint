import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
`;
