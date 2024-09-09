import { mock } from "jest-mock-extended";
import type { InsertResult, Repository } from "typeorm";
import type { DatabaseService } from "~/services/DatabaseService";
import { ProgramService } from "~/services/ProgramService";
import { User } from "~/models/entities/User";
import { Program } from "~/models/entities/Program";
import { ProgramReaction, ProgramReactionType } from "~/models/entities/ProgramReaction";
import { IllegalReactionTypeError } from "~/errors/program/IllegalReactionTypeError";
import { ProgramSnippetType } from "~/models/entities/ProgramSnippet";

const databaseService = mock<DatabaseService>();
const userRepository = mock<Repository<User>>();
const programRepository = mock<Repository<Program>>();
const reactionRepository = mock<Repository<ProgramReaction>>();

beforeEach(() => {
  jest.resetAllMocks();

  databaseService.getRepository.calledWith(User).mockReturnValue(userRepository);
  databaseService.getRepository.calledWith(Program).mockReturnValue(programRepository);
  databaseService.getRepository.calledWith(ProgramReaction).mockReturnValue(reactionRepository);
});

function createProgramService(): ProgramService {
  return new ProgramService(databaseService);
}

describe("ProgramService (integration)", () => {
  describe("createProgram", () => {
    it("inserts a new Program into the database", async () => {
      const insertResult = mock<InsertResult>({ identifiers: [mock<Program>({ id: "1" })] });
      programRepository.insert.mockResolvedValue(insertResult);
      programRepository.findOne.mockResolvedValue(mock<Program>({ id: "1" }));
      userRepository.findOneBy.mockResolvedValue(mock<User>({
        id: "USER_ID",
      }));
      const programService = createProgramService();

      await programService.createProgram(
        "USER_ID",
        "MY_PROGRAM",
        [
          {
            children: [
              {
                type: ProgramSnippetType.Source,
                contentBase64: "const x = 123;",
              },
              {
                type: ProgramSnippetType.Visualizer,
                contentBase64: "const $x = visualizer.scalar({ get: () => x, name: 'x' })",
              },
            ],
          },
        ],
      );

      expect(programRepository.insert).toHaveBeenCalledTimes(1);
      expect(programRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
        author: {
          id: "USER_ID",
        },
        name: "MY_PROGRAM",
        snippets: [
          {
            type: ProgramSnippetType.Source,
            content: "const x = 123;",
          },
          {
            type: ProgramSnippetType.Visualizer,
            content: "const $x = visualizer.scalar({ get: () => x, name: 'x' })",
          },
        ],
      }));
    });

    it("returns a Program entity if the insertion was successful", async () => {
      const insertResult = mock<InsertResult>({ identifiers: [mock<Program>({ id: "1" })] });
      programRepository.findOne.mockResolvedValue(mock<Program>({ id: "1" }));
      programRepository.insert.mockResolvedValue(insertResult);
      userRepository.findOneBy.mockResolvedValue(mock<User>({
        id: "USER_ID",
      }));
      const programService = createProgramService();

      const program = await programService.createProgram(
        "USER_ID",
        "MY_PROGRAM",
        [],
      );

      expect(program?.id).toBe(insertResult.identifiers[0]!.id);
    });
  });

  describe("getAuthor", () => {
    it("returns an author User entity for the given program", async () => {
      const userMock = mock<User>({
        id: "USER_ID",
      });
      const programMock = mock<Program>({
        id: "PROGRAM_ID",
        author: {
          id: userMock.id,
        },
      });

      programRepository.findOne.mockResolvedValue(programMock);
      const programService = createProgramService();

      const author = await programService.getAuthor("PROGRAM_ID");
      expect(author?.id).toBe("USER_ID");
    });

    it("returns undefined if the program does not exist", async () => {
      programRepository.findOne.mockResolvedValue(null);
      const programService = createProgramService();

      const author = await programService.getAuthor("PROGRAM_ID");
      expect(author).toBeUndefined();
    });
  });

  describe("getProgram", () => {
    it("returns a Program instance", async () => {
      const programMock = mock<Program>();
      programRepository.findOne.mockResolvedValue(programMock);
      const programService = createProgramService();

      const program = await programService.getProgram("PROGRAM_ID");
      expect(program).toBe(programMock);
    });

    it("returns undefined if the program does not exist", async () => {
      programRepository.findOne.mockResolvedValue(null);
      const programService = createProgramService();

      const program = await programService.getProgram("PROGRAM_ID");
      expect(program).toBe(undefined);
    });
  });

  describe("reactOnProgram", () => {
    it("inserts a reaction to the database if it does not exist", async () => {
      reactionRepository.findOneBy.calledWith(expect.objectContaining({
        userId: "321",
      })).mockResolvedValue(null);

      const programService = createProgramService();

      await programService.reactOnProgram(
        "321",
        "123",
        ProgramReactionType.Positive,
      );

      expect(reactionRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        userId: "321",
        program: { id: "123" },
        type: ProgramReactionType.Positive,
      }), expect.anything());
    });

    it("throws an IllegalReactionTypeError if the given reaction type is not allowed", async () => {
      const programService = createProgramService();

      await expect(() => programService.reactOnProgram(
        "321",
        "123",
        // @ts-expect-error
        "invalid-reaction-type",
      )).rejects.toThrow(IllegalReactionTypeError);
    });
  });
});
