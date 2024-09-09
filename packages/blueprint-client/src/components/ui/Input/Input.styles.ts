import styled from "styled-components";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import type { SystemTokenColor } from "~/themes/tokens/system/color/SystemTokenColor";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";
import { neumorphicStyles } from "~/components/ui/neumorphicStyles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.8rem;
`;

export const Label = styled.label<{ $color: string }>`
  font: ${(props) => props.theme.tokens.system.common.typography.display.medium};
  line-height: 1.2rem;
  height: 1.2rem;
  color: ${(props) => props.$color};
  transition: ${(props) => props.theme.tokens.system.common.transition.color.surface};
  transition-property: color;
`;

export const InputContainer = styled.span`
  width: 100%;
  position: relative;
`;

export const InputIcon = styled(ReactIconsContextWrapper)`
  position: absolute;
  left: 1rem;
  font-size: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.tokens.dynamic.input.color.icon};
  cursor: text;
  z-index: 2;
`;

export const InputWrapper = styled.span`
  width: 100%;
  position: relative;
`;

export const Input = styled.input<{
  $hasIcon: boolean;
  $size?: SystemTokenSize;
  $focusVisible: boolean;
  $color: SystemTokenColor;
  $rounded: "no" | "left" | "right" | "both";
  $sharpEdges: boolean;
}>`
  width: 100%;

  &:focus {
    outline: 0;
  }
  
  ${neumorphicStyles};
  padding: ${(props) => ((props.$hasIcon)
    ? `0 ${props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.spacing)} 0 3rem`
    : `0 ${props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.spacing)}`)
};
`;

export const Sublabel = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  font: ${(props) => props.theme.tokens.system.common.typography.body.xsmall};
  line-height: 1.2rem;
  height: 1.2rem;
  column-gap: 0.3rem;
  color: ${(props) => props.$color};
  cursor: default;
  transition: ${(props) => props.theme.tokens.system.common.transition.color.text};
  transition-property: color;
`;

export const SublabelIcon = styled(ReactIconsContextWrapper)`
  font-size: 1.2rem;
`;
