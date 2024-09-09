import * as React from "react";
import { useDispatch, useSelector } from "~/store/store";
import { SnippetGroupList } from "~/components/app/SnippetGroupList/SnippetGroupList";
import { Program } from "~/components/app/Program/Program";
import { Visualizer } from "~/components/app/Visualizer/Visualizer";
import * as S from "~/components/views/ProgramView/ProgramView.styles";
import { pageLoaded } from "~/store/systemSlice";
import { View } from "~/components/views/View";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";

export function ProgramView() {
  const snippetGroups = useSelector((state) => state.snippet.snippetGroups);
  const output = useSelector((state) => state.program.output);
  const currentFrameIdx = useSelector((state) => state.program.currentFrameIdx);
  const isBuilt = useSelector((state) => (state.program.output !== undefined));
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(pageLoaded());
  }, []);

  return (
    <View allowGuests allowUsers>
      <S.Container>
        <Program
          mode="view"
          visualizer={
            <Visualizer
              isBuilt={isBuilt}
              entities={output?.state.entities ?? {}}
              frames={output?.state.frames ?? []}
              currentFrameIdx={currentFrameIdx}
            />
          }
          main={
            <>
              <SnippetGroupList
                snippetGroups={snippetGroups}
                showVisualizerSnippets={false}
                readOnly={true}
                showControls={false}
                gap={SystemTokenSize.Medium}
              />
            </>
          }
        />
      </S.Container>
    </View>
  );
}
