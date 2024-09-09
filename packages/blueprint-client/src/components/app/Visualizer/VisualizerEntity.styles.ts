/* eslint-disable max-len, @typescript-eslint/indent */

import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";
import { rem } from "~/utilities/theme/rem";

export const Container = styled(Panel)`
  position: relative;
  width: 100%;
  height: ${({ theme }) => 100 / theme.tokens.system.visualizer.count}%;
  overflow: hidden;
`;

export const Door = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  transform: translateY(
    ${(props) => (
      props.$visible
        ? "-100%"
        : "0"
    )}
  );
  transition: ${({ theme }) => theme.tokens.system.visualizer.transition.door};
  background:
    radial-gradient(circle, ${({ theme }) => theme.tokens.dynamic.surface.color.panel} 0%, rgba(0,0,0,0) 100%),
    linear-gradient(135deg, ${({ theme }) => theme.tokens.dynamic.visualizer.color.door.primary} 25%, transparent 25%) -13px 0/ 26px 26px,
    linear-gradient(225deg, ${({ theme }) => theme.tokens.dynamic.visualizer.color.door.accent} 25%, transparent 25%) -13px 0/ 26px 26px,
    linear-gradient(315deg, ${({ theme }) => theme.tokens.dynamic.visualizer.color.door.primary} 25%, transparent 25%) 0 0/ 26px 26px,
    linear-gradient(45deg, ${({ theme }) => theme.tokens.dynamic.visualizer.color.door.accent} 25%, transparent 25%) 0 0/ 26px 26px;
  background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.panel};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DoorIcon = styled(ReactIconsContextWrapper)`
  width: ${({ theme }) => theme.tokens.system.visualizer.size.hiddenIcon};
  height: ${({ theme }) => theme.tokens.system.visualizer.size.hiddenIcon};
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.hiddenIcon};
`;

export const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.small};
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.panel.medium};
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.visualizerEntryTitle};
`;

export const TitleIcon = styled(ReactIconsContextWrapper)`
  font-size: ${({ theme }) => theme.tokens.system.visualizer.size.visualizerEntryIcon};
  position: relative;
  top: ${rem(1)};
  z-index: 0;
  flex-shrink: 0;
`;

export const TitleContent = styled.p`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const TitleText = styled.span`
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font: ${({ theme }) => theme.tokens.system.common.typography.monospace.bold.xlarge};
`;

export const TypeText = styled.span`
  font: ${({ theme }) => theme.tokens.system.common.typography.display.xsmall};
  text-transform: uppercase;
`;

export const View = styled.div`
  max-width: 100%;
  overflow: auto;
  margin-top: ${({ theme }) => theme.tokens.system.common.spacing.panel.large};
  flex-grow: 1;
  display: flex;
  align-items: center;
  align-self: center;
`;
