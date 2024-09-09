import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  padding: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const UserInfoContainer = styled.div`
  align-self: flex-end;
`;

export const Content = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.tokens.system.common.spacing.surface.xxlarge};
`;
