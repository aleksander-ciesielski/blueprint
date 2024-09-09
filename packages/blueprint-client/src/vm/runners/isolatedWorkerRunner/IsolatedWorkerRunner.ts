import isolatedWorkerRunnerIframeEntry from "worker-plugin/loader?name=iframeEntry!./isolatedWorkerRunnerIframeEntry";
import isolatedWorkerRunnerWorkerEntry from "worker-plugin/loader?name=workerEntry!./isolatedWorkerRunnerWorkerEntry";
import { Deferred } from "@blueprint/common";
import type { IsolatedWorkerRunnerEvents } from "~/vm/runners/isolatedWorkerRunner/IsolatedWorkerRunnerEvents";
import type { WorkerParentIPC } from "~/services/worker/ipc/createWindowParentIPC";
import type { Runner } from "~/types/vm/Runner";
import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { RunnerBuildFailure } from "~/types/vm/RunnerBuildFailure";
import { createWindowParentIPC } from "~/services/worker/ipc/createWindowParentIPC";
import { TYPESCRIPT_LIB_DEFINITIONS } from "~/data/vm/TYPESCRIPT_LIB_DEFINITIONS";

export class IsolatedWorkerRunner implements Runner {
  public static async create(): Promise<IsolatedWorkerRunner> {
    const runner = Deferred.of<IsolatedWorkerRunner>();

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");
    iframe.srcdoc = IsolatedWorkerRunner.createIframeSourceDocumentTemplate(isolatedWorkerRunnerIframeEntry);

    document.body.appendChild(iframe);

    iframe.addEventListener("load", async () => {
      const entry = await fetch(isolatedWorkerRunnerWorkerEntry).then((x) => x.text());
      iframe.contentWindow!.postMessage(entry, "*");

      const ipc = createWindowParentIPC<IsolatedWorkerRunnerEvents>(
        (message) => iframe.contentWindow!.postMessage(message, "*"),
        (message) => (message.origin === "null"),
        (listener) => window.addEventListener("message", listener),
        (listener) => window.removeEventListener("message", listener),
      );

      await ipc.setup(TYPESCRIPT_LIB_DEFINITIONS);

      runner.resolve(new IsolatedWorkerRunner(ipc));
    }, { once: true });

    return runner.promise;
  }

  private static createIframeSourceDocumentTemplate(entryCode: string): string {
    return `
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title></title>
        </head>
        <body>
          <script src="${entryCode}" type="module"></script>
        </body>
      </html>
    `;
  }

  private constructor(
    private readonly ipc: WorkerParentIPC<IsolatedWorkerRunnerEvents>,
  ) {}

  public async build(snippetGroups: SnippetGroup[]): Promise<RunnerBuildOutput | RunnerBuildFailure> {
    return this.ipc.build(snippetGroups);
  }
}
