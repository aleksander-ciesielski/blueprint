import styled from "styled-components";
import { rem } from "~/utilities/theme/rem";
import { Panel } from "~/components/ui/Panel/Panel";

export const Container = styled(Panel)<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto 0 0;
  padding: 0 !important;
  width: ${({ $fullWidth, theme }) => ($fullWidth ? "100%" : theme.tokens.system.editor.container.width.default)};
`;

export const Editor = styled.div`
  width: 100%;
  display: flex;
  border-radius: ${rem(10)};
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
`;

export const HeaderText = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.small};
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.snippetTitle};
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.medium};
`;

export const TitleIcon = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.tokens.system.visualizer.size.snippetIcon};
`;

export const TitleText = styled.span`
  font: ${({ theme }) => theme.tokens.system.common.typography.display.large};
`;

export const Description = styled.p`
  font: ${({ theme }) => theme.tokens.system.common.typography.body.small};
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.snippetDescription};
`;

export const Controls = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  flex-shrink: 0;
`;
