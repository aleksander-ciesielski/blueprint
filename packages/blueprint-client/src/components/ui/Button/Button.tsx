import * as React from "react";
import { useButton, useFocusRing } from "react-aria";
import type { AriaButtonProps } from "react-aria";
import type { IconType } from "react-icons";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import * as S from "~/components/ui/Button/Button.styles";
import { Spinner } from "~/components/icons/Spinner";
import { SystemTokenColor } from "~/themes/tokens/system/color/SystemTokenColor";

export interface ButtonProps extends AriaButtonProps {
  color?: SystemTokenColor;
  icon?: IconType;
  iconLabel?: string;
  size?: SystemTokenSize;
  rounded?: "no" | "left" | "right" | "both";
  sharpEdges?: boolean;
  isLoading?: boolean;
  isSelected?: boolean;
  href?: string;
}

export function Button(props: React.PropsWithChildren<ButtonProps>) {
  const {
    icon, iconLabel, size, ...buttonProps
  } = props;
  const ref = React.useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const button = useButton(buttonProps, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const isLoading = props.isLoading ?? false;
  const isSelected = props.isSelected ?? false;
  const rounded = props.rounded ?? "both";
  const sharpEdges = props.sharpEdges ?? true;
  const color = props.color ?? SystemTokenColor.Default;
  const isIconButton = (props.children === undefined);
  const href = props.href;

  const computedIcon = React.useMemo(() => {
    if (isLoading) {
      return (
        <S.Icon aria-hidden={true} $size={size}>
          <Spinner />
        </S.Icon>
      );
    }

    if (icon !== undefined) {
      return (
        <S.Icon aria-hidden={true} $size={size}>
          {React.createElement(icon, {
            "aria-label": iconLabel,
          })}
        </S.Icon>
      );
    }

    return null;
  }, [isLoading, icon, iconLabel]);

  if (props.href === undefined) {
    return (
      <S.Button
        $size={props.size}
        $focusVisible={isFocusVisible}
        $color={color}
        $isIconButton={isIconButton}
        $rounded={rounded}
        $sharpEdges={sharpEdges}
        {...button.buttonProps}
        {...focusProps}
        ref={ref as React.RefObject<HTMLButtonElement>}
        data-is-pressed={button.isPressed}
        data-is-selected={isSelected}
        role={(href === undefined) ? "button" : "link"}
      >
        {computedIcon}
        {props.children && (
          <S.Text $size={props.size}>
            {props.children}
          </S.Text>)
        }
      </S.Button>
    );
  }

  return (
    <S.ButtonLink
      $size={props.size}
      $focusVisible={isFocusVisible}
      $color={color}
      $isIconButton={isIconButton}
      $rounded={rounded}
      $sharpEdges={sharpEdges}
      {...button.buttonProps}
      {...focusProps}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      data-is-pressed={button.isPressed}
      data-is-selected={isSelected}
      href={props.href}
    >
      {computedIcon}
      {props.children && (
        <S.Text $size={props.size}>
          {props.children}
        </S.Text>)
      }
    </S.ButtonLink>
  );
}
