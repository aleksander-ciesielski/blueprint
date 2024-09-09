import { VisualizerEntityVisibility, type VisualizerFrame, VisualizerEntityType , VisualizerFrameEntityContext , VisualizerEntityDescriptor} from "@blueprint/visualizer";
import * as React from "react";
import { MdVisibilityOff } from "react-icons/md";
import { IoCube } from "react-icons/io5";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import * as S from "~/components/app/Visualizer/VisualizerEntity.styles";
import { useTranslation } from "~/hooks/translation/useTranslation";

export interface VisualizerEntityProps<TEntityType extends VisualizerEntityType, TEntityContext> {
  frames: VisualizerFrame[];
  currentFrameIdx: number;
  descriptor: VisualizerEntityDescriptor<TEntityType>;
  content(context: VisualizerFrameEntityContext<TEntityContext>): React.ReactNode;
}

const VISUALIZER_ENTITY_TYPE_TRANSLATION_TOKEN_MAPPING: Record<VisualizerEntityType, TextTokenSelector<[]>> = {
  [VisualizerEntityType.List]: (tokens) => tokens.program.visualizer.types.list,
  [VisualizerEntityType.Scalar]: (tokens) => tokens.program.visualizer.types.scalar,
};

export function VisualizerEntity<TEntityType extends VisualizerEntityType, TEntityContext>(
  props: VisualizerEntityProps<TEntityType, TEntityContext>,
) {
  const factory = props.content;
  const context = props.frames[props.currentFrameIdx]?.context[props.descriptor.id];
  const visible = (context?.visibility === VisualizerEntityVisibility.Visible);
  const translation = useTranslation();
  const [component, setComponent] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    if (!visible || context === undefined) {
      return;
    }

    setComponent(
      factory(context as VisualizerFrameEntityContext<TEntityContext>),
    );
  }, [factory, context, visible]);

  return (
    <S.Container>
      <S.Door $visible={visible}>
        <S.DoorIcon aria-hidden={true}>
          <MdVisibilityOff />
        </S.DoorIcon>
      </S.Door>
      <S.Content>
        <S.Title>
          <S.TitleIcon aria-hidden={true}>
            <IoCube />
          </S.TitleIcon>
          <S.TitleContent>
            <S.TitleText>
              {props.descriptor.name}
            </S.TitleText>
            <S.TypeText>
              {translation.of(VISUALIZER_ENTITY_TYPE_TRANSLATION_TOKEN_MAPPING[props.descriptor.type])}
            </S.TypeText>
          </S.TitleContent>
        </S.Title>
        <S.View>
          {component}
        </S.View>
      </S.Content>
    </S.Container>
  );
}
