import * as React from "react";
import { LoginView } from "~/components/views/LoginView/LoginView";
import { PageInfo } from "~/components/app/PageInfo";

export default function LoginPage() {
  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.login()} />
      <LoginView />
    </>
  );
}
