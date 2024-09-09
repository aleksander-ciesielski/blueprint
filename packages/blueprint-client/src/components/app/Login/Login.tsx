import * as React from "react";
import { HttpContracts } from "@blueprint/contracts";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { StatusCodes } from "http-status-codes";
import { MdAlternateEmail, MdLock } from "react-icons/md";
import { useServerRequest } from "~/hooks/useServerRequest";
import { useDispatch } from "~/store/store";
import { pushNotification } from "~/store/notificationSlice";
import { refreshSession, setAccessToken } from "~/store/authSlice";
import * as S from "~/components/app/Login/Login.styles";
import { Button } from "~/components/ui/Button/Button";
import { useHttpService } from "~/hooks/useHttpService";
import { RefreshTokenStorageType } from "~/services/HttpService";

interface LoginForm {
  email: string;
  password: string;
  persist: boolean;
}

export default function Login() {
  const [isLoading, setLoadingStatus] = React.useState(false);
  const rememberMeId = React.useId();
  const router = useRouter();
  const dispatch = useDispatch();
  const httpService = useHttpService();
  const loginRequest = useServerRequest(HttpContracts.loginContract);
  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
      persist: true,
    },
  });

  const setFormErrors = React.useCallback((errors: Set<HttpContracts.LoginErrorCode>) => {
    if (errors.has(HttpContracts.LoginErrorCode.UserNotFound)) {
      form.setError("email", { message: "No user with the given email was found." });
    }

    if (errors.has(HttpContracts.LoginErrorCode.InvalidPassword)) {
      form.setError("password", { message: "Invalid password." });
    }
  }, []);

  const handleSubmit = form.handleSubmit(async (payload, event) => {
    event?.preventDefault();
    setLoadingStatus(true);

    try {
      const response = await loginRequest.execute({
        email: payload.email,
        password: payload.password,
      });

      const errors = new Set(
        response.map({
          [StatusCodes.OK]: () => [],
          [StatusCodes.UNAUTHORIZED]: (data) => data.errors,
        }),
      );

      setFormErrors(errors);

      const data = response.castOrThrow(StatusCodes.OK);

      const refreshTokenStorageType = (payload.persist)
        ? RefreshTokenStorageType.Persistent
        : RefreshTokenStorageType.Session;

      httpService.setRefreshToken(data.refreshToken, refreshTokenStorageType);

      dispatch(setAccessToken(data.accessToken));
      await dispatch(refreshSession());

      await dispatch(pushNotification({
        type: "success",
        content: "Successfully logged in.",
      }));

      await router.push("/");
    } catch (e) {
      await dispatch(pushNotification({
        type: "danger",
        content: "Could not log in",
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
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <label>
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
            </label>
          )}
        />
        <S.RememberMe>
          <Controller
            name="persist"
            control={form.control}
            disabled={isLoading}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                id={rememberMeId}
              />
            )}
          />
          <S.RememberMeLabel htmlFor={rememberMeId}>
            Remember me
          </S.RememberMeLabel>
        </S.RememberMe>
        <S.SubmitButton isLoading={isLoading} type="submit">
          Log In
        </S.SubmitButton>
      </S.Form>
      <S.Separator aria-hidden={true} />
      <S.RegisterSection>
        <S.RegisterSectionText>
          No account yet?
        </S.RegisterSectionText>
        <Button href="/register">
          Sign Up
        </Button>
      </S.RegisterSection>
    </S.Container>
  );
}
