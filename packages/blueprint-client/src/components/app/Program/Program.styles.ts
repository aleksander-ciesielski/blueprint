/* eslint-disable max-len */

import styled from "styled-components";
import { Panel } from "~/components/ui/Panel/Panel";
import { Box } from "~/components/ui/Box/Box";
import { Button } from "~/components/ui/Button/Button";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";

export const Wrapper = styled.div<{ $mainContentHeightPx: number }>`
  height: calc(${({ $mainContentHeightPx }) => $mainContentHeightPx}px + ${({ theme }) => theme.tokens.system.program.extraHeight});
`;

export const ProgramInfo = styled(Panel)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgramNameContainer = styled.div`
  display: flex;
  column-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  align-items: center;
  color: ${({ theme }) => theme.tokens.dynamic.panel.color.text};
`;

export const ProgramName = styled.h2`
  font: ${({ theme }) => theme.tokens.system.common.typography.display.xxlarge};
  padding-left: ${({ theme }) => theme.tokens.system.common.spacing.panel.large};
`;

export const ProgramNameEditButton = styled(Button)`

`;

export const ControlsWrapper = styled.div`
  width: 100%;
  height: calc(100vh);
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.tokens.system.layer.programControls};
  pointer-events: none;
`;

export const ControlsBox = styled(Box)`
  width: 100%;
  padding-top: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  pointer-events: auto;
`;

export const ControlsPanel = styled(Panel)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const LeftControls = styled.nav`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const RightControls = styled.nav`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const ButtonGroup = styled.div<{ $spacing?: boolean }>`
  display: flex;
  column-gap: ${({ theme, $spacing }) => (($spacing) ? theme.tokens.system.common.spacing.surface.large : "0")};
`;

export const MainControls = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Progress = styled.div<{ $progress: number }>`
  width: 25%;
  height: 5px;
  position: relative;
  background-color: ${(props) => props.theme.tokens.dynamic.program.color.progressTrack};
  overflow: hidden;
  border-radius:
      0
      0
      ${({ theme }) => theme.tokens.system.common.radius.small}
      ${({ theme }) => theme.tokens.system.common.radius.small};
  box-shadow:
    ${(props) => props.theme.tokens.system.button.shadow.surface.primary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary}, 
    ${(props) => props.theme.tokens.system.button.shadow.surface.secondary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary};
  
  &::after {
    content: "";
    position: absolute;
    left: -100%;
    top: 0;
    height: 5px;
    background-color: ${(props) => props.theme.tokens.dynamic.program.color.progress};
    width: 100%;
    transform: translateX(${({ $progress }) => `${$progress * 100}%`});
    transition: ${({ theme }) => theme.tokens.system.program.transition.progressPosition};
    border-radius: ${({ $progress, theme }) => (($progress === 1) ? "0" : theme.tokens.system.common.radius.small)};
  }
`;

export const Visualizations = styled.div`
  position: absolute;
  width: ${({ theme }) => theme.tokens.system.visualizer.width.panel};
  top: calc(100% + ${({ theme }) => theme.tokens.system.common.spacing.surface.medium});
  height: calc(100vh - 100% - 3 * ${({ theme }) => theme.tokens.system.common.spacing.surface.medium});
  left: 0;
  pointer-events: auto;
`;

export const Main = styled.div<{ $marginTopPx: number }>`
  margin-top: calc(-100vh + ${({ theme }) => theme.tokens.system.common.spacing.surface.medium} + ${({ $marginTopPx }) => $marginTopPx}px);
`;
