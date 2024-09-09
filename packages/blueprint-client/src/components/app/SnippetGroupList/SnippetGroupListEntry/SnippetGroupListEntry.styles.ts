import styled from "styled-components";

export const Container = styled.div`

`;

export const Controls = styled.div`
  margin-right: auto;
  padding: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.tokens.dynamic.surface.color.panel};
`;

export const Snippets = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Link = styled.span`
  width: calc(${({ theme }) => theme.tokens.system.editor.container.width.default} / 4);
  height: 4rem;
  display: block;
  position: relative;

  &::before, &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 50%;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    top: 2rem;
  }
`;

export const LeftToRightLink = styled(Link)`
  &::before {
    border-left: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
    border-bottom: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }

  &::after {
    border-right: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }
`;

export const RightToLeftLink = styled(Link)`
  &::before {
    border-right: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
    border-bottom: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }

  &::after {
    border-left: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }
`;

export const LeftToLeftLink = styled(Link)`
  &::before {
    border-left: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }

  &::after {
    border-left: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }
`;

export const RightToRightLink = styled(Link)`
  &::before {
    border-right: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }

  &::after {
    border-right: ${({ theme }) => theme.tokens.dynamic.visualizer.border.link};
  }
`;
