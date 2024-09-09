import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
`;

export const RegisterPanel = styled(Panel)`

`;
