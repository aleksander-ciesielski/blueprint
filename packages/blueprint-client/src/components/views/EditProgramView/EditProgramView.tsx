import * as React from "react";
import { HttpContracts } from "@blueprint/contracts";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { useDispatch, useSelector } from "~/store/store";
import { SnippetGroupList } from "~/components/app/SnippetGroupList/SnippetGroupList";
import { Program } from "~/components/app/Program/Program";
import { Visualizer } from "~/components/app/Visualizer/Visualizer";
import * as S from "~/components/views/EditProgramView/EditProgramView.styles";
import { pageLoaded } from "~/store/systemSlice";
import { View } from "~/components/views/View";
import { recomputeAllSnippetOffsets, snippetsSet } from "~/store/snippetSlice";
import { programSet } from "~/store/programSlice";

export interface EditProgramViewProps {
  id: string | undefined;
  program: HttpContracts.Program | undefined;
}

export function EditProgramView(props: EditProgramViewProps) {
  const snippetGroups = useSelector((state) => state.snippet.snippetGroups);
  const output = useSelector((state) => state.program.output);
  const currentFrameIdx = useSelector((state) => state.program.currentFrameIdx);
  const buildInProgress = useSelector((state) => state.program.buildInProgress);
  const isBuilt = useSelector((state) => (state.program.output !== undefined));
  const program = props.program;
  const programId = props.id;
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(programSet(
      (program === undefined || programId === undefined)
        ? undefined
        : {
          programId,
          authorId: program.authorId,
          programName: program.name,
          positiveReactions: 0,
          negativeReactions: 0,
          userReaction: HttpContracts.ProgramReaction.None,
        },
    ));

    dispatch(snippetsSet({
      snippetGroups: program?.snippetGroups ?? [],
    }));

    dispatch(recomputeAllSnippetOffsets());
  }, [program, programId]);

  React.useEffect(() => {
    dispatch(pageLoaded());
  }, []);

  return (
    <View allowUsers redirect="/login">
      <S.Container>
        <Program
          mode="edit"
          visualizer={
            <Visualizer
              isBuilt={isBuilt}
              entities={output?.state.entities ?? {}}
              frames={output?.state.frames ?? []}
              currentFrameIdx={currentFrameIdx}
            />
          }
          main={
            <SnippetGroupList
              snippetGroups={snippetGroups}
              readOnly={buildInProgress}
              showControls={true}
              showVisualizerSnippets={true}
              gap={SystemTokenSize.ExtraLarge}
            />
          }
        />
      </S.Container>
    </View>
  );
}
