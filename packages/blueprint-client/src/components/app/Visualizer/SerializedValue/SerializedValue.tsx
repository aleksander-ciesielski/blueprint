import { match } from "ts-pattern";
import * as S from "~/components/app/Visualizer/SerializedValue/SerializedValue.styles";

export interface SerializedValueProps {
  value: unknown;
  className?: string;
}

function serialize(value: unknown): string {
  return match(typeof value)
    .with("undefined", () => "undefined")
    .with("number", () => String(value))
    .with("bigint", () => `${(value as bigint).toString()}n`)
    .with("string", () => `"${value}"`)
    .with("symbol", () => String(value))
    .with("boolean", () => String(value))
    .with("function", () => "function")
    .with("object", () => {
      if (value === null) {
        return "null";
      }

      return JSON.stringify(value);
    })
    .exhaustive();
}

export function SerializedValue(props: SerializedValueProps) {
  return (
    <S.Container className={props.className} data-type={typeof props.value}>
      {serialize(props.value)}
    </S.Container>
  );
}
