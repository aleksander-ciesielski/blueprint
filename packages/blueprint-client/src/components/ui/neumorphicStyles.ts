import { css, type DefaultTheme } from "styled-components";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import type { SystemTokenColor } from "~/themes/tokens/system/color/SystemTokenColor";

function resolveDefaultBorderRadius(theme: DefaultTheme, sharpEdges: boolean): string {
  return (sharpEdges)
    ? "0"
    : theme.tokens.system.common.softRadius;
}

export const neumorphicStyles = css<{
  $size?: SystemTokenSize;
  $focusVisible: boolean;
  $color: SystemTokenColor;
  $rounded: "no" | "left" | "right" | "both";
  $sharpEdges: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.columnGap)};
  border-radius:
    ${(props) => (
    (props.$rounded === "left" || props.$rounded === "both")
      ? props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.common.radius)
      : resolveDefaultBorderRadius(props.theme, props.$sharpEdges)
  )}
    ${(props) => (
    (props.$rounded === "right" || props.$rounded === "both")
      ? props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.common.radius)
      : resolveDefaultBorderRadius(props.theme, props.$sharpEdges)
  )}
    ${(props) => (
    (props.$rounded === "right" || props.$rounded === "both")
      ? props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.common.radius)
      : resolveDefaultBorderRadius(props.theme, props.$sharpEdges)
  )}
    ${(props) => (
    (props.$rounded === "left" || props.$rounded === "both")
      ? props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.common.radius)
      : resolveDefaultBorderRadius(props.theme, props.$sharpEdges)
  )};
height: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.height)};
border: 0;
background-color: ${(props) => props.theme.tokens.dynamic.surface.color.panel};
transition:
  ${(props) => props.theme.tokens.system.common.transition.color.surface}, 
  ${(props) => props.theme.tokens.system.common.transition.color.shadow},
  ${(props) => props.theme.tokens.system.common.transition.color.text},
  ${(props) => props.theme.tokens.system.common.transition.opacity};
padding: ${(props) => `0 ${props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.spacing)}`};
min-width: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.minWidth)};
color: ${(props) => props.theme.tokens.dynamic.button.color.text.regular};
box-shadow:
  ${(props) => props.theme.tokens.system.button.shadow.surface.primary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
  ${(props) => props.theme.tokens.system.button.shadow.surface.secondary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary},
  inset 0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
  inset 0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary};

&[disabled]:not([data-is-selected=true]) {
  opacity: 0.6;
}
  
&:not([disabled]) {
  &:not([data-is-selected=true]):hover {
    box-shadow:
      ${(props) => props.theme.tokens.system.button.shadow.surface.primary.hover} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
      ${(props) => props.theme.tokens.system.button.shadow.surface.secondary.hover} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary},
      inset 0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
      inset 0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary};
  
    color: ${(props) => props.theme.tokens.dynamic.button.color.text.hover};
  }
  
  &:focus-visible {
    outline: ${(props) => (props.$focusVisible ? "auto" : "0")};
  } 
}

&[data-is-pressed=true]:not([disabled]), &[data-is-selected=true] {
  box-shadow:
    0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
    0 0 0 ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary},
    inset ${(props) => props.theme.tokens.system.button.shadow.surface.primary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.primary},
    inset ${(props) => props.theme.tokens.system.button.shadow.surface.secondary.regular} ${(props) => props.theme.tokens.dynamic.button.color.shadow.surface.secondary} !important;

    color: ${(props) => props.theme.tokens.dynamic.button.color.text.active} !important;
}
`;
