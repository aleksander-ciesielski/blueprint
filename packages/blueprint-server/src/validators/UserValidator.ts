import { injectable } from "tsyringe";
import { HttpContracts } from "@blueprint/contracts";

export interface UserValidationData {
  email: string;
  name: string;
  password: string;
}

@injectable()
export class UserValidator {
  private static readonly PASSWORD_MIN_LENGTH = 5;
  private static readonly NAME_MIN_LENGTH = 5;
  private static readonly NAME_MAX_LENGTH = 40;
  private static readonly EMAIL_REGEX = /^[^@]+@[^@]+$/;

  // eslint-disable-next-line class-methods-use-this
  public validate(data: UserValidationData): HttpContracts.RegisterErrorCode[] {
    const errors: HttpContracts.RegisterErrorCode[] = [];

    if (UserValidator.PASSWORD_MIN_LENGTH > data.password.length) {
      errors.push(HttpContracts.RegisterErrorCode.PasswordTooShort);
    }

    if (UserValidator.NAME_MIN_LENGTH > data.name.length) {
      errors.push(HttpContracts.RegisterErrorCode.NameTooShort);
    }

    if (data.name.length > UserValidator.NAME_MAX_LENGTH) {
      errors.push(HttpContracts.RegisterErrorCode.NameTooLong);
    }

    if (!UserValidator.EMAIL_REGEX.test(data.email)) {
      errors.push(HttpContracts.RegisterErrorCode.MalformedEmail);
    }

    return errors;
  }
}
