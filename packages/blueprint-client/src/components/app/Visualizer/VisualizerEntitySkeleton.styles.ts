import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";
import * as VisualizerEntityS from "~/components/app/Visualizer/VisualizerEntity.styles";

export const Container = styled(Panel)`
  width: 100%;
  height: ${({ theme }) => 100 / theme.tokens.system.visualizer.count}%;
  opacity: 0.3;
`;

export const Content = styled(VisualizerEntityS.Content)`
  padding-top: 0.6rem;
`;

export const TitleContent = styled(VisualizerEntityS.TitleContent)`
  row-gap: 0.5rem;
`;

export const TitleSkeleton = styled.span`
  display: block;
  width: 7rem;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.visualizerEntryTitle};
`;

export const TypeSkeleton = styled.span`
  display: block;
  width: 2rem;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.visualizerEntryTitle};
`;
