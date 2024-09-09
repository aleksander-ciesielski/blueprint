import { injectable } from "tsyringe";
import type { Repository } from "typeorm";
import { UserNotFoundError } from "~/errors/user/UserNotFoundError";
import { User } from "~/models/entities/User";
import { DatabaseService } from "~/services/DatabaseService";

@injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  public constructor(databaseService: DatabaseService) {
    this.userRepository = databaseService.getRepository(User);
  }

  public async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
