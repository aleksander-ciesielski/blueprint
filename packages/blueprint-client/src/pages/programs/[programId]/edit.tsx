import * as React from "react";
import { useParams } from "next/navigation";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import { NotFoundView } from "~/components/views/NotFoundView/NotFoundView";
import { LoaderView } from "~/components/views/LoaderView";
import { useServerRequest } from "~/hooks/useServerRequest";
import { HttpResponseCastError } from "~/errors/HttpResponseCastError";
import { EditProgramView } from "~/components/views/EditProgramView/EditProgramView";
import { useSelector } from "~/store/store";
import { PageInfo } from "~/components/app/PageInfo";

type EditProgramPageParams = {
  programId: string;
};

export default function EditProgramPage() {
  const request = useServerRequest(HttpContracts.getProgramContract);
  const [programData, setProgramData] = React.useState<HttpContracts.GetProgramOkResponse>();
  const [ready, setReady] = React.useState(false);
  const programName = useSelector((state) => state.program.name);
  const userId = useSelector((state) => state.auth.userId);
  const params = useParams<EditProgramPageParams>();

  React.useEffect(() => {
    (async () => {
      const response = await request.execute(
        new HttpContracts.GetProgramRequest(params.programId),
      );

      try {
        const data = response.castOrThrow(StatusCodes.OK);

        setProgramData(
          (data.program.authorId === userId)
            ? data
            : undefined,
        );
      } catch (e) {
        if (!(e instanceof HttpResponseCastError)) {
          throw e;
        }

        setProgramData(undefined);
      } finally {
        setReady(true);
      }
    })();

    return () => request.abort();
  }, [userId]);

  if (!ready) {
    return <LoaderView />;
  }

  if (programData === undefined) {
    return <NotFoundView />;
  }

  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.editProgram(programName)} />
      <EditProgramView
        program={programData.program}
        id={params.programId}
      />
    </>
  );
}
