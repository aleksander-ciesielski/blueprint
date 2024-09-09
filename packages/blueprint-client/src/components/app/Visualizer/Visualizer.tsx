import { match } from "ts-pattern";
import { VisualizerEntityType } from "@blueprint/visualizer";
import * as React from "react";
import type { VisualizerEntityDescriptor, VisualizerFrame, VisualizerFrameEntityContext } from "@blueprint/visualizer";
import { VisualizerScalarEntity } from "~/components/app/Visualizer/VisualizerScalarEntity/VisualizerScalarEntity";
import * as S from "~/components/app/Visualizer/Visualizer.styles";
import { VisualizerEntity } from "~/components/app/Visualizer/VisualizerEntity";
import { useTheme } from "~/hooks/theme/useTheme";
import { VisualizerEntitySkeleton } from "~/components/app/Visualizer/VisualizerEntitySkeleton";
import { VisualizerListEntity } from "~/components/app/Visualizer/VisualizerListEntity/VisualizerListEntity";

export interface VisualizerProps {
  isBuilt: boolean;
  entities: Record<string, VisualizerEntityDescriptor<VisualizerEntityType>>;
  frames: VisualizerFrame[];
  currentFrameIdx: number;
}

export function Visualizer(props: VisualizerProps) {
  const visualizationCount = useTheme().tokens.system.visualizer.count;
  const isBuilt = props.isBuilt;
  const frames = props.frames;
  const currentFrameIdx = props.currentFrameIdx;
  const entities = props.entities;

  const entityElements = React.useMemo<React.JSX.Element[]>(() => {
    if (!isBuilt) {
      return [];
    }

    return Object.entries(entities).map(([id, descriptor]) => (
      <VisualizerEntity
        key={id}
        frames={frames}
        currentFrameIdx={currentFrameIdx}
        descriptor={descriptor}
        content={
          match(descriptor.type)
            .with(VisualizerEntityType.Scalar, () => (context: VisualizerFrameEntityContext<unknown>) => (
              <VisualizerScalarEntity
                descriptor={descriptor as VisualizerEntityDescriptor<VisualizerEntityType.Scalar>}
                context={context}
              />
            ))
            .with(VisualizerEntityType.List, () => (context: VisualizerFrameEntityContext<unknown[]>) => (
              <VisualizerListEntity
                descriptor={descriptor as VisualizerEntityDescriptor<VisualizerEntityType.List>}
                context={context}
              />
            ))
            .exhaustive()
        }
      />
    ));
  }, [isBuilt, frames, currentFrameIdx, entities]);

  const skeletons = (entityElements.length >= visualizationCount)
    ? []
    : Array.from({ length: visualizationCount - entityElements.length })
      .map((_, idx) => (
        <VisualizerEntitySkeleton key={idx} />
      ));

  return (
    <S.EntityList>
      {entityElements}
      {skeletons}
    </S.EntityList>
  );
}
