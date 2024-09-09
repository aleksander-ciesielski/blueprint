import type { HttpContracts } from "@blueprint/contracts";
import * as S from "~/components/app/ProgramList/ProgramList.styles";
import { ProgramListEntry } from "~/components/app/ProgramList/ProgramListEntry/ProgramListEntry";

export interface ProgramListProps {
  programs: HttpContracts.ProgramEntry[];
}

export function ProgramList(props: ProgramListProps) {
  return (
    <S.Container>
      <S.List>
        {props.programs.map((program) => (
          <ProgramListEntry
            key={program.programId}
            program={program}
          />
        ))}
      </S.List>
    </S.Container>
  );
}
