import * as React from "react";
import { ProgramListView } from "~/components/views/ProgramListView/ProgramListView";
import { PageInfo } from "~/components/app/PageInfo";

export default function IndexPage() {
  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.index()} />
      <ProgramListView />
    </>
  );
}
