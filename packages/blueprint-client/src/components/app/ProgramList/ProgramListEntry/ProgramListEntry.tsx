import type { HttpContracts } from "@blueprint/contracts";
import * as S from "~/components/app/ProgramList/ProgramListEntry/ProgramListEntry.styles";

export interface ProgramListEntryProps {
  program: HttpContracts.ProgramEntry;
}

export function ProgramListEntry(props: ProgramListEntryProps) {
  return (
    <S.Container>
      <S.ViewLink href={`/programs/${props.program.programId}`}>
        {props.program.name}
      </S.ViewLink>
    </S.Container>
  );
}
