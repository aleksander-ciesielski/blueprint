import type {
 PayloadAction } from "@reduxjs/toolkit";
import { type AsyncThunk, createAsyncThunk, createSlice 
} from "@reduxjs/toolkit";
import { HttpContracts } from "@blueprint/contracts";
import { match } from "ts-pattern";
import { StatusCodes } from "http-status-codes";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import type { RunnerBuildOutput } from "~/types/vm/RunnerBuildOutput";
import type { RootState } from "~/store/store";
import { snippetService } from "~/hooks/snippets/useSnippetService";
import { ProgramAutoplaySpeed } from "~/entities/program/ProgramAutoplaySpeed";
import { pushNotification } from "~/store/notificationSlice";
import { TranslationManager } from "~/translation/TranslationManager";
import { HttpService } from "~/services/HttpService";
import { SnippetType } from "~/entities/snippet/Snippet";

interface ProgramSetPayload {
  programId: string;
  authorId: string;
  programName: string;
  positiveReactions: number;
  negativeReactions: number;
  userReaction: HttpContracts.ProgramReaction;
}

interface ReactionsUpdatedPayload {
  positiveReactions: number;
  negativeReactions: number;
  userReaction: HttpContracts.ProgramReaction;
}

interface CurrentFrameChangedPayload {
  frame: number;
}

interface AutoplaySpeedChangedPayload {
  speed: ProgramAutoplaySpeed;
}

export const programBuilt: AsyncThunk<RunnerBuildOutput | undefined, SnippetGroup[], any> = createAsyncThunk(
  "program/built",
  async (snippetGroups) => snippetService.build(snippetGroups),
);

async function updateProgram(
  programId: string,
  programName: string,
  snippetGroups: SnippetGroup[],
) {
  const httpService = new HttpService();
  const request = httpService.request({
    contract: HttpContracts.updateProgramContract,
  });

  await request.execute(
    new HttpContracts.UpdateProgramRequest(
      programId,
      programName,
      snippetGroups.map((group) => ({
        children: group.children.map((snippet) => ({
          type: match(snippet.type)
            .with(SnippetType.Source, () => HttpContracts.ProgramSnippetType.Source)
            .with(SnippetType.Visualizer, () => HttpContracts.ProgramSnippetType.Visualizer)
            .with(SnippetType.Markdown, () => HttpContracts.ProgramSnippetType.Markdown)
            .exhaustive(),
          codeBase64: btoa(snippet.code),
        })),
      })),
    ),
  );
}

async function createProgram(
  programName: string,
  snippetGroups: SnippetGroup[],
): Promise<string | undefined> {
  const httpService = new HttpService();
  const request = httpService.request({
    contract: HttpContracts.createProgramContract,
  });

  const response = await request.execute(
    new HttpContracts.CreateProgramRequest(
      snippetGroups.map((group) => ({
        children: group.children.map((snippet) => ({
          type: match(snippet.type)
            .with(SnippetType.Source, () => HttpContracts.ProgramSnippetType.Source)
            .with(SnippetType.Visualizer, () => HttpContracts.ProgramSnippetType.Visualizer)
            .with(SnippetType.Markdown, () => HttpContracts.ProgramSnippetType.Markdown)
            .exhaustive(),
          codeBase64: btoa(snippet.code),
        })),
      })),
      programName,
    ),
  );

  return response.map({
    [StatusCodes.CREATED]: ({ programId }) => programId,
    [StatusCodes.BAD_REQUEST]: () => undefined,
  });
}

export const programSaved: AsyncThunk<void, SnippetGroup[], any> = createAsyncThunk(
  "program/saved",
  async (snippetGroups, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    if (state.program.id === undefined) {
      const programId = await createProgram(state.program.name, snippetGroups);
      await import("next/client")
        .then(({ router }) => router.push(`/programs/${programId}/edit`));
    } else {
      await updateProgram(state.program.id, state.program.name, snippetGroups);
    }

    thunkAPI.dispatch(pushNotification({
      type: "success",
      content: TranslationManager.getInstance().textOf((tokens) => tokens.program.successfullySaved),
    }));
  },
);

export const programForked: AsyncThunk<void, SnippetGroup[], any> = createAsyncThunk(
  "program/forked",
  async (snippetGroups, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    if (state.program.id === undefined) {
      return;
    }

    const programId = await createProgram(`Copy of ${state.program.name}`, snippetGroups);

    thunkAPI.dispatch(pushNotification({
      type: "success",
      content: TranslationManager.getInstance().textOf((tokens) => tokens.program.successfullyForked),
    }));

    await import("next/client")
      .then(({ router }) => router.push(`/programs/${programId}/edit`));
  },
);

export const programSlice = createSlice({
  name: "program",
  initialState: {
    dirty: false,
    buildInProgress: false,
    saveInProgress: false,
    forkInProgress: false,
    id: undefined as string | undefined,
    authorId: undefined as string | undefined,
    name: "Untitled program",
    positiveReactions: 0,
    negativeReactions: 0,
    userReaction: HttpContracts.ProgramReaction.None,
    output: undefined as RunnerBuildOutput | undefined,
    currentFrameIdx: 0,
    autoplayEnabled: false,
    autoplaySpeed: ProgramAutoplaySpeed.Normal,
  },
  reducers: {
    programSet(state, action: PayloadAction<ProgramSetPayload | undefined>) {
      state.id = action.payload?.programId;
      state.authorId = action.payload?.authorId;
      state.name = action.payload?.programName ?? "Untitled program";
      state.output = undefined;
      state.currentFrameIdx = 0;
      state.positiveReactions = action.payload?.positiveReactions ?? 0;
      state.negativeReactions = action.payload?.negativeReactions ?? 0;
      state.userReaction = action.payload?.userReaction ?? HttpContracts.ProgramReaction.None;
    },
    programCodeUpdated(state) {
      state.dirty = true;
      state.output = undefined;
      state.currentFrameIdx = 0;
    },
    programNameUpdated(state, action: PayloadAction<string>) {
      state.dirty = (state.name !== action.payload);
      state.name = action.payload;
    },
    reactionsUpdated(state, action: PayloadAction<ReactionsUpdatedPayload>) {
      state.positiveReactions = action.payload.positiveReactions;
      state.negativeReactions = action.payload.negativeReactions;
      state.userReaction = action.payload.userReaction;
    },
    currentFrameDecremented(state) {
      if (state.output === undefined || state.buildInProgress) {
        return;
      }

      if (state.currentFrameIdx === 0) {
        return;
      }

      state.currentFrameIdx -= 1;
    },
    currentFrameIncremented(state) {
      if (state.output === undefined || state.buildInProgress) {
        return;
      }

      if (state.currentFrameIdx === state.output.state.frames.length - 1) {
        return;
      }

      state.currentFrameIdx += 1;
    },
    currentFrameChanged(state, action: PayloadAction<CurrentFrameChangedPayload>) {
      if (
        state.output === undefined
        || 0 > action.payload.frame
        || action.payload.frame >= state.output.state.frames.length
      ) {
        return;
      }

      state.currentFrameIdx = action.payload.frame;
    },
    autoplayEnabled(state) {
      if (state.currentFrameIdx + 1 === state.output?.state.frames.length) {
        state.currentFrameIdx = 0;
      }

      state.autoplayEnabled = true;
    },
    autoplayDisabled(state) {
      state.autoplayEnabled = false;
    },
    autoplaySpeedChanged(state, action: PayloadAction<AutoplaySpeedChangedPayload>) {
      state.autoplaySpeed = action.payload.speed;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(programBuilt.pending, (state) => {
      state.currentFrameIdx = 0;
      state.buildInProgress = true;
      state.autoplayEnabled = false;
      state.output = undefined;
    });

    builder.addCase(programBuilt.fulfilled, (state, { payload }) => {
      state.buildInProgress = false;
      state.output = payload;
      state.currentFrameIdx = 0;
      state.autoplayEnabled = false;
    });

    builder.addCase(programSaved.pending, (state) => {
      state.saveInProgress = true;
    });

    builder.addCase(programSaved.fulfilled, (state) => {
      state.saveInProgress = false;
      state.dirty = false;
    });

    builder.addCase(programForked.pending, (state) => {
      state.forkInProgress = true;
    });

    builder.addCase(programForked.fulfilled, (state) => {
      state.forkInProgress = false;
    });
  },
});

export const {
  programSet,
  programCodeUpdated,
  programNameUpdated,
  reactionsUpdated,
  currentFrameDecremented,
  currentFrameIncremented,
  currentFrameChanged,
  autoplayEnabled,
  autoplayDisabled,
  autoplaySpeedChanged,
} = programSlice.actions;

export const programReducer = programSlice.reducer;
