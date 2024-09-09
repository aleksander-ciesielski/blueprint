import { mock } from "jest-mock-extended";
import type { Repository } from "typeorm";
import type { DatabaseService } from "~/services/DatabaseService";
import { User } from "~/models/entities/User";
import { ProgramService } from "~/services/ProgramService";
import { Program } from "~/models/entities/Program";
import { ProgramReaction, ProgramReactionType } from "~/models/entities/ProgramReaction";

beforeEach(() => {
  jest.resetAllMocks();
});

const databaseService = mock<DatabaseService>();
const programRepository = mock<Repository<Program>>();
const userRepository = mock<Repository<User>>();
const reactionRepository = mock<Repository<ProgramReaction>>();

function createProgramService(): ProgramService {
  databaseService.getRepository.calledWith(Program).mockReturnValue(programRepository);
  databaseService.getRepository.calledWith(User).mockReturnValue(userRepository);
  databaseService.getRepository.calledWith(ProgramReaction).mockReturnValue(reactionRepository);

  return new ProgramService(databaseService);
}

describe("ProgramService", () => {
  describe("createProgram", () => {
    it("creates a program", async () => {
      const name = "Test ProgramId";
      const userEmail = "abc@gmail.com";

      userRepository.findOneBy
        .mockResolvedValue(mock<User>());
      programRepository.findOne.mockResolvedValue(mock<Program>({ id: "1" }));

      programRepository.insert.mockResolvedValue({
        identifiers: [{ id: "1" }],
        generatedMaps: [],
        raw: [],
      });

      const programService = createProgramService();
      const result = await programService.createProgram(userEmail, name, []);

      expect(programRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        name,
      }));

      expect(result?.id).toBe("1");
    });
  });

  describe("reactOnProgram", () => {
    it("inserts a reaction into the database if it does not exist", async () => {
      reactionRepository.findOneBy.calledWith(expect.objectContaining({
        userId: "123",
      })).mockResolvedValue(null);

      const programService = createProgramService();

      await programService.reactOnProgram(
        "123",
        "321",
        ProgramReactionType.Negative,
      );

      expect(reactionRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        userId: "123",
        program: { id: "321" },
        type: ProgramReactionType.Negative,
      }), expect.anything());
    });
  });
});
