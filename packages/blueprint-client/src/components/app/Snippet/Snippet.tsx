import * as React from "react";
import type { IconType } from "react-icons";
import type { SnippetType } from "~/entities/snippet/Snippet";
import * as S from "~/components/app/Snippet/Snippet.styles";

export interface SnippetProps {
  type: SnippetType;
  title: React.ReactNode;
  description: React.ReactNode;
  icon: IconType;
  editor: React.ReactNode;
  className?: string;
  controls: React.ReactNode;
  showControls: boolean;
}

export function Snippet(props: SnippetProps) {
  const controls = (props.showControls)
    ? (
      <S.Header>
        <S.HeaderText>
          <S.Title>
            <S.TitleIcon aria-hidden={true}>
              {React.createElement(props.icon)}
            </S.TitleIcon>
            <S.TitleText>
              {props.title}
            </S.TitleText>
          </S.Title>
          <S.Description>
            {props.description}
          </S.Description>
        </S.HeaderText>
        <S.Controls>
          {props.controls}
        </S.Controls>
      </S.Header>
    )
    : null;

  return (
    <S.Container className={props.className} $fullWidth={!props.showControls}>
      {controls}
      <S.Editor>
        {props.editor}
      </S.Editor>
    </S.Container>
  );
}
