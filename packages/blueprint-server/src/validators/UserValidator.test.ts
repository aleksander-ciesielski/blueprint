import { HttpContracts } from "@blueprint/contracts";
import type { UserValidationData } from "~/validators/UserValidator";
import { UserValidator } from "~/validators/UserValidator";

function createUserValidationData(data: Partial<UserValidationData> = {}): UserValidationData {
  return {
    name: data.name ?? "Aleksander Ciesielski",
    email: data.email ?? "contact@aleksanderciesiel.ski",
    password: data.password ?? "QsXfFOdYbh0MhZyTnoZKhgU7ruI9TlCh",
  };
}

function createUserValidator(): UserValidator {
  return new UserValidator();
}

describe("UserValidator", () => {
  describe("validate", () => {
    it("returns an empty error array if all fields are correct", () => {
      const userValidator = createUserValidator();

      expect(userValidator.validate(createUserValidationData())).toEqual([]);
    });

    it("returns a PasswordTooShort error if the password is too short", () => {
      const userValidator = createUserValidator();

      const errors = userValidator.validate(createUserValidationData({
        password: "",
      }));

      expect(errors).toContain(HttpContracts.RegisterErrorCode.PasswordTooShort);
    });

    it("returns a NameTooShort error if the name is too short", () => {
      const userValidator = createUserValidator();

      const errors = userValidator.validate(createUserValidationData({
        name: "",
      }));

      expect(errors).toContain(HttpContracts.RegisterErrorCode.NameTooShort);
    });

    it("returns a PasswordTooShort error if the name is too long", () => {
      const userValidator = createUserValidator();

      const errors = userValidator.validate(createUserValidationData({
        name: "012345678901234567890123456789012345678901234567890123456789",
      }));

      expect(errors).toContain(HttpContracts.RegisterErrorCode.NameTooLong);
    });

    it("returns a MalformedEmail error if the email is invalid", () => {
      const userValidator = createUserValidator();

      const errors = userValidator.validate(createUserValidationData({
        email: "@@@",
      }));

      expect(errors).toContain(HttpContracts.RegisterErrorCode.MalformedEmail);
    });
  });
});
