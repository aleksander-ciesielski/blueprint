import styled from "styled-components";

export const Logo = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
  text-transform: uppercase;
`;

export const LogoPrimary = styled.span`
  font: ${({ theme }) => theme.tokens.system.common.typography.logo.primary};
  color: ${({ theme }) => theme.tokens.dynamic.logo.color.primary};
`;

export const LogoAccent = styled.span`
  font: ${({ theme }) => theme.tokens.system.common.typography.logo.accent};
  color: ${({ theme }) => theme.tokens.dynamic.logo.color.accent};
`;
