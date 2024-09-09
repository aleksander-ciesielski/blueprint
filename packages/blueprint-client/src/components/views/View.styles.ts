import styled from "styled-components";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  margin-top: ${({ theme }) => theme.tokens.system.common.spacing.surface.xxlarge};
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  flex-grow: 1;
`;

export const Loader = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const LoaderIcon = styled(ReactIconsContextWrapper)`
  font-size: ${({ theme }) => theme.tokens.system.layout.size.spinner};
  color: ${({ theme }) => theme.tokens.dynamic.layout.color.spinner};
`;
