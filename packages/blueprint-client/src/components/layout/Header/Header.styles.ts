import styled from "styled-components";
import Link from "next/link";
import { Panel } from "~/components/ui/Panel/Panel";
import { Logo } from "~/components/app/Logo/Logo";

export const Container = styled(Panel)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.panel};
  padding: 0 ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
`;

export const CenterLogoLink = styled(Link)`
  display: contents;
`;

export const CenterLogo = styled(Logo)`
  
`;

export const RightMenu = styled.nav`
  position: absolute;
  right: ${({ theme }) => theme.tokens.system.common.spacing.surface.large};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
