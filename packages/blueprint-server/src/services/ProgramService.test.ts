import { mock } from "jest-mock-extended";
import type { EntityManager, Repository } from "typeorm";
import type { DatabaseService } from "~/services/DatabaseService";
import { User } from "~/models/entities/User";
import { ProgramService } from "~/services/ProgramService";
import { Program } from "~/models/entities/Program";
import { ProgramReaction, ProgramReactionType } from "~/models/entities/ProgramReaction";

beforeEach(() => {
  jest.resetAllMocks();
});

const databaseService = mock<DatabaseService>({
  connection: {
    transaction: async (fn) => (fn as ((manager: EntityManager) => Promise<void>))(mock()),
  },
});
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
      programRepository.save.mockResolvedValue(mock<Program>({ id: "1" }));

      programRepository.insert.mockResolvedValue({
        identifiers: [{ id: "1" }],
        generatedMaps: [],
        raw: [],
      });

      const programService = createProgramService();
      const result = await programService.createProgram(userEmail, name, []);

      expect(programRepository.save).toHaveBeenCalledWith(expect.objectContaining({
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

      expect(reactionRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        userId: "123",
        program: { id: "321" },
        type: ProgramReactionType.Negative,
      }));
    });
  });
});
