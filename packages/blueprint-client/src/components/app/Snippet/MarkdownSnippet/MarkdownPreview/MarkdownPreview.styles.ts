import styled from "styled-components";

export const Container = styled.div`
  
`;

export const Markdown = styled.div`
  display: contents;
  font: ${({ theme }) => theme.tokens.system.common.typography.body.medium};
  
  & h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.tokens.dynamic.markdown.color.heading};
  }
  
  & h1 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.xxlarge};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.small} 0;
  }

  & h2 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.large};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.small} 0;
  }

  & h3 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.medium};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall} 0;
  }

  & h4 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.medium};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall} 0;
  }
  
  & h5 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.medium};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall} 0;
  }
  
  & h6 {
    font: ${({ theme }) => theme.tokens.system.common.typography.display.medium};
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall} 0;
  }
  
  code {
    font: ${({ theme }) => theme.tokens.system.common.typography.monospace.regular.medium};
  }
  
  code:not([class]) {
    display: inline;
    padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xsmall};
    border-radius: ${({ theme }) => theme.tokens.system.markdown.radius.inlineCode};
    background-color: ${({ theme }) => theme.tokens.dynamic.markdown.color.inlineCode};
    margin: 0 ${({ theme }) => theme.tokens.system.common.spacing.panel.small};
  }
  
  .katex {
    margin: 0 ${({ theme }) => theme.tokens.system.common.spacing.panel.small};
  }
`;
