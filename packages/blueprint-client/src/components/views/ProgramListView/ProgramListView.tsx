import * as React from "react";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import { useDispatch } from "~/store/store";
import * as S from "~/components/views/ProgramListView/ProgramListView.styles";
import { pageLoaded } from "~/store/systemSlice";
import { View } from "~/components/views/View";
import { useServerRequest } from "~/hooks/useServerRequest";
import { ProgramList } from "~/components/app/ProgramList/ProgramList";
import { useTranslation } from "~/hooks/translation/useTranslation";

export function ProgramListView() {
  const dispatch = useDispatch();
  const [programs, setPrograms] = React.useState<HttpContracts.ProgramEntry[]>([]);
  const getPrograms = useServerRequest(HttpContracts.getAllProgramsContract);
  const translation = useTranslation();

  React.useEffect(() => {
    getPrograms.execute(undefined).then((response) => {
      setPrograms(response.castOrThrow(StatusCodes.OK).programs);
      dispatch(pageLoaded());
    });

    return () => getPrograms.abort();
  }, []);

  return (
    <View allowGuests allowUsers>
      <S.Container>
        <ProgramList programs={programs} />
        <S.EditorLinkContainer>
          <S.EditorLink href="/editor">
            {translation.of((tokens) => tokens.program.newProgram)}
          </S.EditorLink>
        </S.EditorLinkContainer>
      </S.Container>
    </View>
  );
}
