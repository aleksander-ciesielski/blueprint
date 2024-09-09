import * as React from "react";
import { useParams } from "next/navigation";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import { ProgramView } from "~/components/views/ProgramView/ProgramView";
import { NotFoundView } from "~/components/views/NotFoundView/NotFoundView";
import { LoaderView } from "~/components/views/LoaderView";
import { useServerRequest } from "~/hooks/useServerRequest";
import { HttpResponseCastError } from "~/errors/HttpResponseCastError";
import { useDispatch, useSelector } from "~/store/store";
import { programSet } from "~/store/programSlice";
import { recomputeAllSnippetOffsets, snippetsSet } from "~/store/snippetSlice";
import { PageInfo } from "~/components/app/PageInfo";

type ViewProgramPageParams = {
  programId: string;
};

export default function ViewProgramPage() {
  const request = useServerRequest(HttpContracts.getProgramContract);
  const [ready, setReady] = React.useState(false);
  const params = useParams<ViewProgramPageParams>();
  const programId = params.programId;
  const storedProgramId = useSelector((state) => state.program.id);
  const programName = useSelector((state) => state.program.name);
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async () => {
      const response = await request.execute(
        new HttpContracts.GetProgramRequest(params.programId),
      );

      try {
        const programData = response.castOrThrow(StatusCodes.OK);

        dispatch(programSet({
          programId,
          authorId: programData.program.authorId,
          programName: programData.program.name,
          positiveReactions: programData.positiveReactions,
          negativeReactions: programData.negativeReactions,
          userReaction: programData.userReaction,
        }));

        dispatch(snippetsSet({
          snippetGroups: programData.program.snippetGroups,
        }));

        dispatch(recomputeAllSnippetOffsets());
      } catch (e) {
        if (!(e instanceof HttpResponseCastError)) {
          throw e;
        }

        dispatch(programSet(undefined));
        dispatch(snippetsSet({
          snippetGroups: [],
        }));
        dispatch(recomputeAllSnippetOffsets());
      } finally {
        setReady(true);
      }
    })();

    return () => request.abort();
  }, [programId]);

  if (!ready) {
    return <LoaderView />;
  }

  if (storedProgramId === undefined) {
    return <NotFoundView />;
  }

  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.viewProgram(programName)} />
      <ProgramView />
    </>
  );
}
