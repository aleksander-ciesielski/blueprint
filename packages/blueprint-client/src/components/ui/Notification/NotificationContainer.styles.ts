import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: ${({ theme }) => theme.tokens.system.layer.notifications};
  width: auto;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.medium};
  right: ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
  bottom: ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
  left: unset;
`;
