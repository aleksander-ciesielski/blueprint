import styled from "styled-components";
import addVisualizerSvgIcon from "~/assets/icons/add_video.svg";

export const Container = styled.article<{
  $addVisualizerGlyphMarginClassName: string;
  $lineHighlightClassName: string;
  $lineHighlightAnimationName: string;
}>`
  width: 100%;
  position: relative;
  
  .${({ $addVisualizerGlyphMarginClassName }) => $addVisualizerGlyphMarginClassName} {
    cursor: pointer;
    
    &::after {
      content: "";
      width: 14px;
      height: 14px;
      background-image: url(${addVisualizerSvgIcon.src});
      background-size: contain;
      opacity: 0;
      transition: ${({ theme }) => theme.tokens.system.common.transition.opacity};
    }
    
    &:hover {
      &::after {
        opacity: 1;
      }
    }
  }

  .${({ $lineHighlightClassName }) => $lineHighlightClassName} {
    @keyframes ${({ $lineHighlightAnimationName }) => $lineHighlightAnimationName} {
      from {
        opacity: ${({ theme }) => theme.tokens.system.editor.highlight.opacity.blinkA};
      }
    
      to {
        opacity: ${({ theme }) => theme.tokens.system.editor.highlight.opacity.blinkB};
      }
    }
    
    box-sizing: content-box;
    animation-duration: ${({ theme }) => theme.tokens.system.editor.highlight.blinkAnimationDuration};
    animation-name: ${({ $lineHighlightAnimationName }) => $lineHighlightAnimationName};
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-out;
    border-radius: ${({ theme }) => theme.tokens.system.editor.highlight.radius};
    background-color: ${({ theme }) => theme.tokens.dynamic.editor.color.highlight};
  }
`;
