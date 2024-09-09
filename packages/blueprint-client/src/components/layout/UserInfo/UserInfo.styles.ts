import styled from "styled-components";
import { Button } from "~/components/ui/Button/Button";
import { Panel } from "~/components/ui/Panel/Panel";

export const Container = styled(Panel)`
  display: flex;
  align-items: center;
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.xxlarge};
  padding:
    ${({ theme }) => theme.tokens.system.common.spacing.panel.large}
    ${({ theme }) => theme.tokens.system.common.spacing.panel.xxlarge};
`;

export const Text = styled.p`
  font: ${({ theme }) => theme.tokens.system.common.typography.body.medium};
  color: ${({ theme }) => theme.tokens.dynamic.panel.color.text};
  
`;

export const ActionButton = styled(Button)`

`;
