import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    position: relative;
    min-height: 100%;
  }
  
  body {
    background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.background} !important;
  }
`;
