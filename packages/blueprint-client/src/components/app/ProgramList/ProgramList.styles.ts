import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";

export const Container = styled(Panel)`

`;

export const List = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.xxlarge};
`;
