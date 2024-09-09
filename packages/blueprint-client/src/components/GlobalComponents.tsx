import styled from "styled-components";

export const InlineCode = styled.span`
  font: ${({ theme }) => theme.tokens.system.common.typography.monospace.bold.small};
  display: inline;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall};
  border-radius: ${({ theme }) => theme.tokens.system.global.radius.inlineCode};
  background-color: ${({ theme }) => theme.tokens.dynamic.global.color.inlineCode};
  margin: 0 ${({ theme }) => theme.tokens.system.common.spacing.panel.small};
`;

export const UserName = styled.span`
  font-weight: 700;
`;
