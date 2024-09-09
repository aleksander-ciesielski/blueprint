import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid/non-secure";
import { HttpContracts } from "@blueprint/contracts";
import { match } from "ts-pattern";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { Snippet } from "~/entities/snippet/Snippet";
import { SnippetType } from "~/entities/snippet/Snippet";

interface SnippetsSet {
  snippetGroups: HttpContracts.ProgramSnippetGroup[];
}

interface SnippetGroupAdded {
  snippets: Snippet[];
}

interface SnippetAddedPayload {
  groupId: string;
  previousSnippetId: string;
  type: SnippetType;
}

interface SnippetRemovedPayload {
  groupId: string;
  snippetId: string;
}

interface VisualizerSnippetEmbeddedPayload {
  groupId: string;
  snippetId: string;
  lineNumber: number;
}

interface SnippetCodeUpdate {
  groupId: string;
  snippetId: string;
  code: string;
}

function mapContractSnippetGroup(snippetGroup: HttpContracts.ProgramSnippetGroup): SnippetGroup {
  return {
    id: nanoid(),
    children: snippetGroup.children.map((snippet) => ({
      id: nanoid(),
      aliasIds: [],
      aliasCharacterOffset: {},
      offset: 0,
      type: match(snippet.type)
        .with(HttpContracts.ProgramSnippetType.Source, () => SnippetType.Source)
        .with(HttpContracts.ProgramSnippetType.Visualizer, () => SnippetType.Visualizer)
        .with(HttpContracts.ProgramSnippetType.Markdown, () => SnippetType.Markdown)
        .exhaustive(),
      code: atob(snippet.codeBase64),
    })),
  };
}

function recomputeSnippetOffsets(snippetGroups: SnippetGroup[]): void {
  let offset = 0;

  snippetGroups
    .flatMap((snippetGroup) => snippetGroup.children)
    .forEach((snippet) => {
      snippet.offset = offset;
      offset += snippet.code.split("\n").length;
    });
}

const snippetSlice = createSlice({
  name: "snippet",
  initialState: {
    snippetGroups: [] as SnippetGroup[],
  },
  reducers: {
    snippetsSet(state, action: PayloadAction<SnippetsSet>) {
      state.snippetGroups = action.payload.snippetGroups.map((group) => mapContractSnippetGroup(group));
    },
    snippetGroupAdded(state, action: PayloadAction<SnippetGroupAdded>) {
      state.snippetGroups.push({
        id: nanoid(),
        children: action.payload.snippets,
      });
    },
    snippetAdded(state, action: PayloadAction<SnippetAddedPayload>) {
      const snippetGroup = state.snippetGroups.find((el) => (el.id === action.payload.groupId));
      if (snippetGroup === undefined) {
        throw new Error();
      }

      const previousSnippetIdx = (action.payload.previousSnippetId === undefined)
        ? 0
        : snippetGroup.children.findIndex((el) => (el.id === action.payload.previousSnippetId));

      if (previousSnippetIdx === -1) {
        throw new Error();
      }

      const snippet: Snippet = {
        id: nanoid(),
        aliasIds: [],
        aliasCharacterOffset: {},
        code: "",
        offset: 0,
        type: action.payload.type,
      };

      const insertIdx = snippetGroup
        .children
        .slice(previousSnippetIdx + 1)
        .findIndex((el) => (el.type !== SnippetType.Visualizer));

      if (insertIdx === -1) {
        snippetGroup.children.push(snippet);
        return;
      }

      snippetGroup.children.splice(insertIdx + previousSnippetIdx + 1, 0, snippet);
    },
    snippetRemoved(state, action: PayloadAction<SnippetRemovedPayload>) {
      const snippetGroupIdx = state.snippetGroups.findIndex((el) => (el.id === action.payload.groupId));
      if (snippetGroupIdx === -1) {
        throw new Error();
      }

      const snippetIdx = state.snippetGroups[snippetGroupIdx]!
        .children
        .findIndex((el) => (el.id === action.payload.snippetId));

      if (snippetIdx === -1) {
        throw new Error();
      }

      state.snippetGroups[snippetGroupIdx]!.children.splice(snippetIdx, 1);

      if (state.snippetGroups[snippetGroupIdx]!.children.length === 0) {
        state.snippetGroups.splice(snippetGroupIdx, 1);
        return;
      }

      const adjacentSourceSnippetIdx = state.snippetGroups[snippetGroupIdx]!
        .children
        .findIndex((el, idx, arr) => (el.type === SnippetType.Source && arr[idx + 1]?.type === SnippetType.Source));

      if (adjacentSourceSnippetIdx === -1) {
        return;
      }

      const sourceToMergeA = state.snippetGroups[snippetGroupIdx]!.children[adjacentSourceSnippetIdx]!;
      const sourceToMergeB = state.snippetGroups[snippetGroupIdx]!.children[adjacentSourceSnippetIdx + 1]!;

      state.snippetGroups[snippetGroupIdx]!.children.splice(adjacentSourceSnippetIdx, 2, {
        id: nanoid(),
        aliasIds: [],
        aliasCharacterOffset: {},
        code: [sourceToMergeA.code, sourceToMergeB.code].join("\n"),
        offset: 0,
        type: SnippetType.Source,
      });
    },
    snippetCodeUpdated(state, action: PayloadAction<SnippetCodeUpdate>) {
      const snippetGroup = state.snippetGroups.find((el) => (el.id === action.payload.groupId));
      if (snippetGroup === undefined) {
        throw new Error();
      }

      const snippet = snippetGroup.children.find((child) => (
        child.id === action.payload.snippetId
      ));

      if (snippet === undefined) {
        return;
      }

      snippet.code = action.payload.code;

      recomputeSnippetOffsets(state.snippetGroups);
    },
    recomputeAllSnippetOffsets(state) {
      recomputeSnippetOffsets(state.snippetGroups);
    },
    visualizerSnippetEmbedded(state, action: PayloadAction<VisualizerSnippetEmbeddedPayload>) {
      const snippetGroup = state.snippetGroups.find((el) => (el.id === action.payload.groupId));
      if (snippetGroup === undefined) {
        throw new Error();
      }

      const snippetIdx = snippetGroup?.children.findIndex((el) => (el.id === action.payload.snippetId));
      const snippet = snippetGroup?.children[snippetIdx];

      if (snippet === undefined) {
        throw new Error();
      }

      const lines = snippet.code
        .split("\n")
        .map((line) => line.replace(/^(.*?)[\r\n]$/, (_, text) => text));

      const linesBefore = lines.slice(0, action.payload.lineNumber);
      const linesAfter = lines.slice(action.payload.lineNumber);

      const snippetsToAdd: Snippet[] = [
        {
          id: snippet.id,
          aliasIds: [],
          aliasCharacterOffset: {},
          code: linesBefore.join("\n"),
          offset: 0,
          type: snippet.type,
        },
        {
          id: nanoid(),
          aliasIds: [],
          aliasCharacterOffset: {},
          code: "",
          offset: 0,
          type: SnippetType.Visualizer,
        },
        (linesAfter.length === 0)
          ? undefined
          : ({
            id: nanoid(),
            aliasIds: [],
            aliasCharacterOffset: {},
            code: linesAfter.join("\n"),
            offset: 0,
            type: snippet.type,
          }),
      ].filter((el) => (el !== undefined));

      snippetGroup.children.splice(snippetIdx, 1, ...snippetsToAdd);
    },
  },
});

export const {
  snippetsSet,
  snippetGroupAdded,
  recomputeAllSnippetOffsets,
  snippetAdded,
  snippetRemoved,
  snippetCodeUpdated,
  visualizerSnippetEmbedded,
} = snippetSlice.actions;

export const snippetReducer = snippetSlice.reducer;
