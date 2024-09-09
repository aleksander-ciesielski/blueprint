import { DataSource } from "typeorm";
import { injectable } from "tsyringe";
import type { Class, Constructor } from "type-fest";
import type { ObjectLiteral, Repository } from "typeorm";
import { EnvReader } from "~/services/EnvReader";
import { User } from "~/models/entities/User";
import { InvalidatedRefreshToken } from "~/models/entities/InvalidatedRefreshToken";
import { Program } from "~/models/entities/Program";
import { ProgramReaction } from "~/models/entities/ProgramReaction";
import { ProgramSnippet } from "~/models/entities/ProgramSnippet";
import { ProgramSnippetGroup } from "~/models/entities/ProgramSnippetGroup";

@injectable()
export class DatabaseService {
  private static readonly ENTITIES = [
    User,
    InvalidatedRefreshToken,
    Program,
    ProgramReaction,
    ProgramSnippetGroup,
    ProgramSnippet,
  ] satisfies Class<unknown>[];

  public static async create(
    envReader: EnvReader,
  ): Promise<DatabaseService> {
    const connection = new DataSource({
      type: "postgres",
      synchronize: true,
      entities: DatabaseService.ENTITIES,
      host: envReader.getOrThrow("DB_HOST", EnvReader.string),
      port: envReader.getOrThrow("DB_PORT", EnvReader.integer),
      username: envReader.getOrThrow("DB_USER", EnvReader.string),
      password: envReader.getOrThrow("DB_PASS", EnvReader.string),
      database: envReader.getOrThrow("DB_NAME", EnvReader.string),
    });

    await connection.initialize();

    return new DatabaseService(connection);
  }

  public constructor(public readonly connection: DataSource) {}

  public getRepository<const TEntity extends ObjectLiteral>(ctor: Constructor<TEntity>): Repository<TEntity> {
    return this.connection.getRepository(ctor);
  }
}
