import type {
  VisualizerEntityDescriptor,
  VisualizerEntityType,
  VisualizerFrameEntityContext,
} from "@blueprint/visualizer";
import * as S from "~/components/app/Visualizer/VisualizerScalarEntity/VisualizerScalarEntity.styles";

export interface VisualizerScalarEntityProps {
  descriptor: VisualizerEntityDescriptor<VisualizerEntityType.Scalar>;
  context: VisualizerFrameEntityContext<unknown>;
}

export function VisualizerScalarEntity(props: VisualizerScalarEntityProps) {
  return (
    <S.Value value={props.context.value} />
  );
}
