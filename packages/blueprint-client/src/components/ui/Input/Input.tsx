import * as React from "react";
import { match } from "ts-pattern";
import classNames from "classnames";
import { useFocusRing } from "react-aria";
import type { InputHTMLAttributes } from "react";
import type { SystemTokenColor } from "~/themes/tokens/system/color/SystemTokenColor";
import type { IconType } from "react-icons";
import type { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { useTheme } from "~/hooks/theme/useTheme";
import * as S from "~/components/ui/Input/Input.styles";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  appearance?: "default" | "error" | "success" | undefined;
  label: string;
  value?: string | undefined;
  type?: string | undefined;
  sublabel?: string | undefined;
  keepSublevelArea?: boolean | undefined;
  placeholder?: string | undefined;
  icon?: IconType;
  color?: SystemTokenColor;
  iconLabel?: string;
  size?: SystemTokenSize;
  rounded?: "no" | "left" | "right" | "both";
  sharpEdges?: boolean;
  isLoading?: boolean;
}

export function Input(props: InputProps) {
  const {
    appearance,
    label,
    sublabel,
    icon,
    keepSublevelArea,
    className,
    ...inputProps
  } = props;

  const theme = useTheme();
  const labelId = React.useId();
  const inputId = React.useId();
  const sublabelId = React.useId();
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { isFocusVisible, focusProps } = useFocusRing();
  const isLoading = props.isLoading ?? false;
  const rounded = props.rounded ?? "both";
  const sharpEdges = props.sharpEdges ?? true;
  const isIconButton = (props.children === undefined);

  const handleInputContainerClick = React.useCallback(() => inputRef.current?.focus(), []);
  const handleInputFocus = React.useCallback(() => setFocused(true), []);
  const handleInputBlur = React.useCallback(() => setFocused(false), []);
  const handleSublabelClick = React.useCallback(() => inputRef.current?.focus(), []);

  const isError = (appearance === "error");
  const hasIcon = (icon !== undefined);

  const appearanceBasedColor = match(appearance)
    .with("default", () => theme.tokens.dynamic.input.color.default)
    .with("error", () => theme.tokens.dynamic.input.color.error)
    .with("success", () => theme.tokens.dynamic.input.color.success)
    .otherwise(() => theme.tokens.dynamic.input.color.default);

  const color = (focused)
    ? theme.tokens.dynamic.input.color.focused
    : appearanceBasedColor;

  const sublabelIcon = match(appearance)
    .with("default", () => "info")
    .with("error", () => "error")
    .with("success", () => "check-circle")
    .otherwise(() => "info");

  return (
    <S.Container className={className}>
      <S.Label
        $color={color}
        id={labelId}
        htmlFor={inputId}
      >
        {label}
      </S.Label>
      <S.InputContainer onClickCapture={handleInputContainerClick}>
        {hasIcon && (
          <S.InputIcon aria-hidden={true}>
            {React.createElement(icon)}
          </S.InputIcon>
        )}
        <S.InputWrapper className={classNames({ focused })}>
          <S.Input
            $color={color as any}
            $hasIcon={hasIcon}
            id={inputId}
            ref={inputRef}
            type={inputProps.type}
            aria-labelledby={labelId}
            aria-invalid={isError}
            aria-errormessage={isError ? sublabelId : undefined}
            placeholder={inputProps.placeholder}
            value={inputProps.value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            $rounded={rounded}
            $sharpEdges={sharpEdges}
            $focusVisible={isFocusVisible}
            {...inputProps}
            size={undefined}
            data-is-pressed={focused}
          />
        </S.InputWrapper>
      </S.InputContainer>
      {(sublabel || keepSublevelArea === true) && (
        <S.Sublabel
          id={sublabelId}
          $color={color}
          onClick={handleSublabelClick}
          aria-hidden={sublabel === undefined}
        >
          {sublabel ? <S.SublabelIcon aria-hidden={true}>{sublabelIcon}</S.SublabelIcon> : undefined}
          {sublabel}
        </S.Sublabel>
      )}
    </S.Container>
  );
}
