/* eslint-disable max-len */

import styled from "styled-components";

export const Container = styled.article<{ $rounded: boolean }>`
  background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.panel};
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  border-radius: ${({ theme, $rounded }) => (
    $rounded
      ? theme.tokens.system.common.radius.medium
      : "0"
  )};
  box-shadow:
    ${(props) => props.theme.tokens.system.button.shadow.surface.primary.regular} ${(props) => props.theme.tokens.dynamic.surface.color.shadow.primary},
    ${(props) => props.theme.tokens.system.button.shadow.surface.secondary.regular} ${(props) => props.theme.tokens.dynamic.surface.color.shadow.secondary};
`;
