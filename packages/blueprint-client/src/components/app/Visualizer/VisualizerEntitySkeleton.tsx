import { IoCube } from "react-icons/io5";
import * as React from "react";
import * as S from "~/components/app/Visualizer/VisualizerEntitySkeleton.styles";
import * as VisualizerEntityS from "~/components/app/Visualizer/VisualizerEntity.styles";

export function VisualizerEntitySkeleton() {
  return (
    <S.Container aria-hidden={true}>
      <S.Content>
        <VisualizerEntityS.Title>
          <VisualizerEntityS.TitleIcon aria-hidden={true}>
            <IoCube />
          </VisualizerEntityS.TitleIcon>
          <S.TitleContent>
            <VisualizerEntityS.TitleText>
              <S.TitleSkeleton />
            </VisualizerEntityS.TitleText>
            <VisualizerEntityS.TypeText>
              <S.TypeSkeleton />
            </VisualizerEntityS.TypeText>
          </S.TitleContent>
        </VisualizerEntityS.Title>
      </S.Content>
    </S.Container>
  );
}
