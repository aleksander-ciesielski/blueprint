import { ProgramControlService } from "~/vm/ProgramControlService";

export function useProgramControlService(): ProgramControlService {
  return ProgramControlService.getInstance();
}
