import * as React from "react";
import { HttpContracts } from "@blueprint/contracts";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { StatusCodes } from "http-status-codes";
import { MdAlternateEmail, MdLock } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { useServerRequest } from "~/hooks/useServerRequest";
import { useDispatch } from "~/store/store";
import { pushNotification } from "~/store/notificationSlice";
import * as S from "~/components/app/Register/Register.styles";
import { Button } from "~/components/ui/Button/Button";

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}

export default function Register() {
  const [isLoading, setLoadingStatus] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const registerRequest = useServerRequest(HttpContracts.registerContract);
  const form = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
  });

  const setFormErrors = React.useCallback((errors: Set<HttpContracts.RegisterErrorCode>) => {
    if (errors.has(HttpContracts.RegisterErrorCode.EmailInUse)) {
      form.setError("email", { message: "The given email is already in use." });
    }

    if (errors.has(HttpContracts.RegisterErrorCode.NameTooShort)) {
      form.setError("username", { message: "The given name is too short." });
    }

    if (errors.has(HttpContracts.RegisterErrorCode.NameTooLong)) {
      form.setError("username", { message: "The given name is too long." });
    }

    if (errors.has(HttpContracts.RegisterErrorCode.MalformedEmail)) {
      form.setError("email", { message: "Invalid format of the given email." });
    }

    if (errors.has(HttpContracts.RegisterErrorCode.PasswordTooShort)) {
      form.setError("password", { message: "The given password is too short." });
    }
  }, []);

  const handleSubmit = form.handleSubmit(async (payload, event) => {
    event?.preventDefault();

    if (payload.password !== payload.repeatPassword) {
      form.setError("repeatPassword", { message: "Passwords do not match." });

      return;
    }

    setLoadingStatus(true);

    try {
      const response = await registerRequest.execute({
        email: payload.email,
        name: payload.username,
        password: payload.password,
      });

      const errors = new Set(
        response.map({
          [StatusCodes.CREATED]: () => [],
          [StatusCodes.BAD_REQUEST]: (data) => data.errors,
        }),
      );

      setFormErrors(errors);

      response.castOrThrow(StatusCodes.CREATED);

      await dispatch(pushNotification({
        type: "success",
        content: "Successfully created a new account.",
      }));

      await router.push("/login");
    } catch (e) {
      await dispatch(pushNotification({
        type: "danger",
        content: "Could not create an account.",
      }));
    } finally {
      setLoadingStatus(false);
    }
  });

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit}>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <S.TextInput
              required
              label="Email address"
              icon={MdAlternateEmail}
              disabled={isLoading}
              placeholder="Enter your email address"
              appearance={fieldState.invalid ? "error" : "default"}
              keepSublevelArea={true}
              sublabel={form.getFieldState("email").error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <S.TextInput
              required
              label="Full name"
              icon={IoMdPerson}
              disabled={isLoading}
              placeholder="Enter your full name"
              appearance={fieldState.invalid ? "error" : "default"}
              keepSublevelArea={true}
              sublabel={form.getFieldState("username").error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <S.TextInput
              required
              label="Password"
              type="password"
              icon={MdLock}
              disabled={isLoading}
              placeholder="Enter your password"
              appearance={fieldState.invalid ? "error" : "default"}
              keepSublevelArea={true}
              sublabel={form.getFieldState("password").error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="repeatPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <S.TextInput
              required
              label="Repeat password"
              type="password"
              icon={MdLock}
              disabled={isLoading}
              placeholder="Repeat password"
              appearance={fieldState.invalid ? "error" : "default"}
              keepSublevelArea={true}
              sublabel={form.getFieldState("repeatPassword").error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <S.SubmitButton isLoading={isLoading} type="submit">
          Sign Up
        </S.SubmitButton>
      </S.Form>
      <S.Separator aria-hidden={true} />
      <S.RegisterSection>
        <S.RegisterSectionText>
          Already have an account?
        </S.RegisterSectionText>
        <Button href="/login">
          Log In
        </Button>
      </S.RegisterSection>
    </S.Container>
  );
}
