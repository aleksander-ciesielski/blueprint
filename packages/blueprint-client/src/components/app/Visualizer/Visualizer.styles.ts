import styled from "styled-components";

export const EntityList = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.tokens.system.common.spacing.surface.medium};
`;

export const Entity = styled.article`

`;
