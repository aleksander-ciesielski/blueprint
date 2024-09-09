import {
  Visualizer,
  VisualizerEntityVisibility,
  VisualizerReevaluateError,
  VisualizerReevaluateErrorReason,
} from "@blueprint/visualizer";
import type { VisualizerState } from "@blueprint/visualizer";
import type { Snippet } from "~/entities/snippet/Snippet";
import { AlgorithmCodeTransformer } from "~/services/vm/AlgorithmCodeTransformer";
import { UnsafeInlineRunner } from "~/vm/runners/unsafeInlineRunner/UnsafeInlineRunner";
import { SnippetFixtureFactory } from "~/integration/fixtures/SnippetFixtureFactory";

async function run(
  createSnippets: (factory: SnippetFixtureFactory) => Snippet[],
): Promise<VisualizerState> {
  const algorithmCodeTransformer = AlgorithmCodeTransformer.createWithPhysicalLibs();
  const runner = new UnsafeInlineRunner(algorithmCodeTransformer);
  const factory = new SnippetFixtureFactory();

  const group = factory.group(createSnippets(factory));

  const output = await runner.build([group]);
  return output.state;
}

describe("Snippet updates", () => {
  it("yields no frames for no snippets", async () => {
    const { frames } = await run(() => []);

    expect(frames).toEqual([]);
  });

  it("yields no frames for no tracked entities", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
    ]);

    expect(frames).toEqual([]);
  });

  it("yields a frame when an entity is registered", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("yields a frame when an entity value is updated", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.source("x increment", `
        x += 1;
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x increment",
        context: {
          x: { value: 1, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("does not yield a frame when an entity value remains the same", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.source("x increment", `
        x += 1;
      `),
      snippet.source("x non-mutating update", `
        x = 1;
      `),
      snippet.source("x non-mutating update 2", `
        x = 1;
      `),
      snippet.source("x non-mutating update 3", `
        x = 1;
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x increment",
        context: {
          x: { value: 1, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("yields a frame when an entity becomes hidden", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.hide();
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x hide",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Hidden },
        },
      }),
    ]);
  });

  it("does not yield a frame when an already hidden entity becomes hidden", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.hide();
      `),
      snippet.visualizer("x hide 2", `
        $x.hide();
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x hide",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Hidden },
        },
      }),
    ]);
  });

  it("does not yield a frame when the value of a hidden entity is updated", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.hide();
      `),
      snippet.source("x increment", `
        x += 1;
      `),
      snippet.source("x increment", `
        x += 1;
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x hide",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Hidden },
        },
      }),
    ]);
  });

  it("yields a frame once a hidden entity becomes visible (no value changes)", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.hide();
      `),
      snippet.visualizer("x show", `
        $x.show();
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x hide",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Hidden },
        },
      }),
      expect.objectContaining({
        snippetId: "x show",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("yields a frame once a hidden entity becomes visible (value changes)", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.hide();
      `),
      snippet.source("x increment", `
        x += 1;
      `),
      snippet.source("x increment 2", `
        x += 1;
      `),
      snippet.source("x increment 3", `
        x += 1;
      `),
      snippet.visualizer("x show", `
        $x.show();
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
      expect.objectContaining({
        snippetId: "x hide",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Hidden },
        },
      }),
      expect.objectContaining({
        snippetId: "x show",
        context: {
          x: { value: 3, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("does not yield a frame when an already visible entity becomes visible", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.visualizer("x track", `
        const $x = visualizer.scalar<number>({
          get: () => x,
          name: "x",
        });
      `),
      snippet.visualizer("x hide", `
        $x.show();
      `),
    ]);

    expect(frames).toEqual([
      expect.objectContaining({
        snippetId: "x track",
        context: {
          x: { value: 0, visibility: VisualizerEntityVisibility.Visible },
        },
      }),
    ]);
  });

  it("does not yield a frame for Markdown entities", async () => {
    const { frames } = await run((snippet) => [
      snippet.source("x", `
        let x = 0;
      `),
      snippet.markdown("markdown", "__hi__"),
      snippet.markdown("markdown 2", "_hello_"),
    ]);

    expect(frames).toEqual([]);
  });

  it("throws a VisualizerReevaluateError(EntityTrackingEnabledInVisibleSnippet) when an entity started being tracked in a visible snippet", () => {
    expect(async () => {
      await run((snippet) => [
        snippet.source("x", `
          let x = 0;
        `),
        snippet.source("x track", `
          const $x = visualizer.scalar<number>({
            get: () => x,
            name: "x",
          });
        `),
      ]);
    }).rejects.toThrow(
      expect.objectContaining(
        new VisualizerReevaluateError(VisualizerReevaluateErrorReason.EntityTrackingEnabledInVisibleSnippet),
      ),
    );
  });

  it("throws a VisualizerReevaluateError(TrackedEntityVisibilityChangedInVisibleSnippet) when an entity visibility is changed in a visible snippet (hide)", () => {
    expect(async () => {
      await run((snippet) => [
        snippet.source("x", `
          let x = 0;
        `),
        snippet.visualizer("x track", `
          const $x = visualizer.scalar<number>({
            get: () => x,
            name: "x",
          });
        `),
        snippet.source("x hide", `
          $x.hide();
        `),
      ]);
    }).rejects.toThrow(
      expect.objectContaining(
        new VisualizerReevaluateError(VisualizerReevaluateErrorReason.TrackedEntityVisibilityChangedInVisibleSnippet),
      ),
    );
  });

  it("throws a VisualizerReevaluateError(TrackedEntityVisibilityChangedInVisibleSnippet) when an entity visibility is changed in a visible snippet (show)", () => {
    expect(async () => {
      await run((snippet) => [
        snippet.source("x", `
          let x = 0;
        `),
        snippet.visualizer("x track", `
          const $x = visualizer.scalar<number>({
            get: () => x,
            name: "x",
          });
        `),
        snippet.visualizer("x hide", `
          $x.hide();
        `),
        snippet.source("x show", `
          $x.show();
        `),
      ]);
    }).rejects.toThrow(
      expect.objectContaining(
        new VisualizerReevaluateError(VisualizerReevaluateErrorReason.TrackedEntityVisibilityChangedInVisibleSnippet),
      ),
    );
  });

  it("throws a VisualizerReevaluateError(TrackedEntityValueChangedInHiddenSnippet) when an entity value is updated in a hidden snippet", () => {
    expect(async () => {
      await run((snippet) => [
        snippet.source("x", `
          let x = 0;
        `),
        snippet.visualizer("x track", `
          const $x = visualizer.scalar<number>({
            get: () => x,
            name: "x",
          });
        `),
        snippet.visualizer("x increment", `
          x += 1;
        `),
      ]);
    }).rejects.toThrow(
      expect.objectContaining(
        new VisualizerReevaluateError(VisualizerReevaluateErrorReason.TrackedEntityValueChangedInHiddenSnippet),
      ),
    );
  });

  it("throws a VisualizerReevaluateError(TooManyVisualizerEntities) when the number of visualizer entities exceeds Visualizer.MAX_VISUALIZER_ENTITIES", () => {
    expect(Visualizer.MAX_VISUALIZER_ENTITIES).toBe(4);
    expect(async () => {
      await run((snippet) => [
        snippet.visualizer("first", `
          const $1 = visualizer.scalar<void>({
            get: () => {},
            name: "1",
          });
        `),
        snippet.visualizer("second", `
          const $2 = visualizer.scalar<void>({
            get: () => {},
            name: "2",
          });
        `),
        snippet.visualizer("third", `
          const $3 = visualizer.scalar<void>({
            get: () => {},
            name: "3",
          });
        `),
        snippet.visualizer("fourth", `
          const $4 = visualizer.scalar<void>({
            get: () => {},
            name: "4",
          });
        `),
        snippet.visualizer("fifth", `
          const $5 = visualizer.scalar<void>({
            get: () => {},
            name: "5",
          });
        `),
      ]);
    }).rejects.toThrow(
      expect.objectContaining(
        new VisualizerReevaluateError(VisualizerReevaluateErrorReason.TooManyVisualizerEntities),
      ),
    );
  });
});
