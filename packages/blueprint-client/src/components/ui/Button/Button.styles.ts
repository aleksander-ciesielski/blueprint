/* eslint-disable max-len, @typescript-eslint/indent */

import styled, { css } from "styled-components";
import Link from "next/link";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import type { SystemTokenColor } from "~/themes/tokens/system/color/SystemTokenColor";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";
import { neumorphicStyles } from "~/components/ui/neumorphicStyles";

const commonStyles = css<{
  $size?: SystemTokenSize
  $isIconButton: boolean;
}>`
  padding: ${(props) => (
      props.$isIconButton
          ? "unset"
          : `0 ${props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.spacing)}`
  )};
  min-width: ${(props) => (
      props.$isIconButton
          ? props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.height)
          : props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.minWidth)
  )};

  &:not([disabled]) {
    cursor: pointer;
  }
`;

export const Button = styled.button<{
  $size?: SystemTokenSize;
  $focusVisible: boolean;
  $color: SystemTokenColor;
  $isIconButton: boolean;
  $rounded: "no" | "left" | "right" | "both";
  $sharpEdges: boolean;
}>`
  ${neumorphicStyles};
  ${commonStyles};
`;

export const ButtonLink = styled(Link)<{
  $size?: SystemTokenSize;
  $focusVisible: boolean;
  $color: SystemTokenColor;
  $isIconButton: boolean;
  $rounded: "no" | "left" | "right" | "both";
  $sharpEdges: boolean;
}>`
  ${neumorphicStyles};
  ${commonStyles};
  
  text-decoration: none;
`;

export const Icon = styled(ReactIconsContextWrapper)<{ $size?: SystemTokenSize }>`
  width: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.icon.size)};
  height: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.icon.size)};
`;

export const Text = styled.span<{ $size?: SystemTokenSize }>`
  font: ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.common.typography.display)};
  transition: ${(props) => props.theme.tokens.system.common.transition.color.textShadow};
  text-shadow:
      ${(props) => props.theme.tokens.dynamic.button.color.shadow.text} ${(props) => props.theme.resolveSizeBasedToken(props.$size, props.theme.tokens.system.button.shadow.text)};
`;
