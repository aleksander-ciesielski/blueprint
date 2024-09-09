import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";
import { Button } from "~/components/ui/Button/Button";

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
`;

export const EditorLinkContainer = styled(Panel)`

`;

export const EditorLink = styled(Button)`
  
`;
