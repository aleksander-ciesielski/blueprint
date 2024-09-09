import * as React from "react";
import { EditProgramView } from "~/components/views/EditProgramView/EditProgramView";
import { PageInfo } from "~/components/app/PageInfo";

export default function EditorPage() {
  return (
    <>
      <PageInfo title={(tokens) => () => tokens.page.title.editor()} />
      <EditProgramView program={undefined} id={undefined} />
    </>
  );
}
