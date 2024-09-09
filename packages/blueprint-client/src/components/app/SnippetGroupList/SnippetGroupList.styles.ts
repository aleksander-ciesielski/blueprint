import styled from "styled-components";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { Panel } from "~/components/ui/Panel/Panel";

export const Container = styled.div`
  padding-left: calc(
    ${({ theme }) => theme.tokens.system.visualizer.width.panel}
    + ${({ theme }) => theme.tokens.system.common.spacing.surface.medium}
  );
`;

export const Controls = styled(Panel)`
  margin-right: auto;
  width: 100%;
  display: flex;
  margin-top: ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.xxlarge};
`;

export const SnippetGroups = styled.div<{ $gap: SystemTokenSize }>`
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => props.theme.tokens.system.common.spacing.surface[props.$gap]};
`;
