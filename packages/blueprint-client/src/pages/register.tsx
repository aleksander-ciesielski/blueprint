import * as React from "react";
import { RegisterView } from "~/components/views/RegisterView/RegisterView";
import { PageInfo } from "~/components/app/PageInfo";

export default function RegisterPage() {
  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.register()} />
      <RegisterView />
    </>
  );
}
