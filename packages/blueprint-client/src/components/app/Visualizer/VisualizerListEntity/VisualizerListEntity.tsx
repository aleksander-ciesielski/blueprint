import type {
  VisualizerEntityDescriptor,
  VisualizerEntityType,
  VisualizerFrameEntityContext,
} from "@blueprint/visualizer";
import * as S from "~/components/app/Visualizer/VisualizerListEntity/VisualizerListEntity.styles";
import { useTranslation } from "~/hooks/translation/useTranslation";

export interface VisualizerListEntityProps {
  descriptor: VisualizerEntityDescriptor<VisualizerEntityType.List>;
  context: VisualizerFrameEntityContext<unknown[]>;
}

export function VisualizerListEntity(props: VisualizerListEntityProps) {
  const translation = useTranslation();

  const entities = props.context.value.map((value, idx) => (
    <S.ValueListElement key={idx}>
      <S.ValueView>
        <S.Value value={value} />
      </S.ValueView>
      <S.ValueLabel>
          [{idx}]
      </S.ValueLabel>
    </S.ValueListElement>
  ));

  return (
    (entities.length > 0)
      ? (
        <S.ValueList>
          {entities}
        </S.ValueList>
      )
      : (
        <S.NoEntitiesText>
          {translation.of((tokens) => tokens.program.visualizer.list.emptyList)}
        </S.NoEntitiesText>
      )
  );
}
