import { MdBuild, MdModeEdit, MdVisibility } from "react-icons/md";
import * as React from "react";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiFillFastBackward,
  AiFillFastForward,
  AiFillPauseCircle,
  AiFillPlayCircle,
} from "react-icons/ai";
import {
  BsLightningFill,
} from "react-icons/bs";
import { RiGitForkFill, RiSaveFill } from "react-icons/ri";
import { match } from "ts-pattern";
import type { HttpContracts } from "@blueprint/contracts";
import * as S from "~/components/app/Program/Program.styles";
import { Button } from "~/components/ui/Button/Button";
import { useTranslation } from "~/hooks/translation/useTranslation";
import { useDispatch, useSelector } from "~/store/store";
import { useSnippetService } from "~/hooks/snippets/useSnippetService";
import {
  programBuilt, programForked, programNameUpdated, programSaved, reactionsUpdated,
} from "~/store/programSlice";
import { useProgramControlService } from "~/hooks/program/useProgramControlService";
import { ProgramAutoplaySpeed } from "~/entities/program/ProgramAutoplaySpeed";
import { SystemTokenSize } from "~/themes/tokens/system/size/SystemTokenSize";
import { ProgramReactions } from "~/components/app/ProgramReactions/ProgramReactions";

export interface ProgramControlsProps {
  mode: "edit" | "view";
  visualizer: React.ReactNode;
  main: React.ReactNode;
}

export function Program(props: ProgramControlsProps) {
  const translation = useTranslation();
  const dispatch = useDispatch();
  const snippetService = useSnippetService();
  const programControlService = useProgramControlService();
  const [controlsPanelHeightPx, setControlsPanelHeightPx] = React.useState(0);
  const [mainContentHeightPx, setMainContentHeightPx] = React.useState(0);
  const controlsPanelRef = React.useRef<HTMLDivElement>(null);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const snippetGroups = useSelector((state) => state.snippet.snippetGroups);
  const saveInProgress = useSelector((state) => state.program.saveInProgress);
  const buildInProgress = useSelector((state) => state.program.buildInProgress);
  const forkInProgress = useSelector((state) => state.program.forkInProgress);
  const currentFrameIdx = useSelector((state) => state.program.currentFrameIdx);
  const isBuilt = useSelector((state) => (state.program.output !== undefined));
  const frameCount = useSelector((state) => state.program.output?.state.frames.length ?? 0);
  const dirty = useSelector((state) => state.program.dirty);
  const autoplayEnabled = useSelector((state) => state.program.autoplayEnabled);
  const autoplaySpeed = useSelector((state) => state.program.autoplaySpeed);
  const programId = useSelector((state) => state.program.id);
  const programName = useSelector((state) => state.program.name);
  const authorId = useSelector((state) => state.program.authorId);
  const userId = useSelector((state) => state.auth.userId);
  const positiveReactions = useSelector((state) => state.program.positiveReactions);
  const negativeReactions = useSelector((state) => state.program.negativeReactions);
  const userReaction = useSelector((state) => state.program.userReaction);
  const isLoggedIn = useSelector((state) => (state.auth.userId !== undefined));
  const isAuthor = (authorId === userId);
  const progress = (buildInProgress)
    ? 0
    : (currentFrameIdx) / (frameCount - 1);
  const progressPercentage = Math.floor(progress * 100);

  const build = React.useCallback(async () => {
    if (snippetService === undefined) {
      return;
    }

    dispatch(programBuilt(snippetGroups));
  }, [snippetService, snippetGroups]);

  const editName = React.useCallback(() => {
    dispatch(programNameUpdated(prompt("Enter new program name") ?? programName));
  }, [programName]);

  React.useEffect(() => {
    if (props.mode === "view") {
      build().then();
    }
  }, [props.mode, build]);

  const save = React.useCallback(() => {
    if (saveInProgress) {
      return;
    }

    dispatch(programSaved(snippetGroups));
  }, [saveInProgress, snippetGroups]);

  const fork = React.useCallback(() => {
    if (forkInProgress) {
      return;
    }

    dispatch(programForked(snippetGroups));
  }, [snippetGroups, forkInProgress]);

  React.useEffect(() => {
    if (controlsPanelRef.current === null) {
      return;
    }

    setControlsPanelHeightPx(controlsPanelRef.current.getBoundingClientRect().height);
  }, [controlsPanelRef.current]);

  React.useEffect(() => {
    if (mainContentRef.current === null) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (mainContentRef.current === null) {
        return;
      }

      setMainContentHeightPx(mainContentRef.current.getBoundingClientRect().height);
    });

    observer.observe(mainContentRef.current);
    return () => observer.disconnect();
  }, [mainContentRef.current]);

  const handleNewReactions = React.useCallback((okResponse: HttpContracts.ReactOnProgramOkResponse) => {
    dispatch(reactionsUpdated({
      positiveReactions: okResponse.positiveReactions,
      negativeReactions: okResponse.negativeReactions,
      userReaction: okResponse.userReaction,
    }));
  }, []);

  return (
    <S.Wrapper $mainContentHeightPx={mainContentHeightPx}>
      <S.ProgramInfo>
        <S.ProgramNameContainer>
          <S.ProgramName>
            {programName}
          </S.ProgramName>
          {(props.mode === "edit") && <S.ProgramNameEditButton
            icon={MdModeEdit}
            size={SystemTokenSize.ExtraSmall}
            onPress={editName}
          />}
        </S.ProgramNameContainer>
        {(programId !== undefined && props.mode === "view") && <ProgramReactions
          positiveReactions={positiveReactions}
          negativeReactions={negativeReactions}
          userReaction={userReaction}
          programId={programId}
          onNewReactions={handleNewReactions}
          disabled={!isLoggedIn}
        />}
      </S.ProgramInfo>
      <S.ControlsWrapper>
        <S.ControlsBox ref={controlsPanelRef}>
          <S.ControlsPanel>
            <S.LeftControls>
              <S.ButtonGroup $spacing={true}>
                <Button
                  icon={MdBuild}
                  onPress={build}
                  isDisabled={buildInProgress}
                  isLoading={buildInProgress}
                  rounded="left"
                  sharpEdges={false}
                >
                  {translation.of((tokens) => tokens.program.build)}
                </Button>
                {
                  match(props.mode)
                    .with("edit", () => (
                      <>
                        <Button
                          icon={RiSaveFill}
                          onPress={save}
                          isDisabled={!dirty || saveInProgress}
                          isLoading={saveInProgress}
                          rounded="no"
                          sharpEdges={false}
                        >
                          {translation.of((tokens) => tokens.program.save)}
                        </Button>
                        {(programId !== undefined) && <Button
                          icon={MdVisibility}
                          href={`/programs/${programId}`}
                          rounded="right"
                          sharpEdges={false}
                        >
                          {translation.of((tokens) => tokens.program.view)}
                        </Button>}
                      </>
                    ))
                    .with("view", () => (
                      <>
                        {
                          isAuthor && (
                            <Button
                              icon={MdModeEdit}
                              href={`/programs/${programId}/edit`}
                              rounded="no"
                              sharpEdges={false}
                            >
                              {translation.of((tokens) => tokens.program.edit)}
                            </Button>
                          )
                        }
                        <Button
                          icon={RiGitForkFill}
                          onPress={fork}
                          isDisabled={forkInProgress}
                          isLoading={forkInProgress}
                          rounded="right"
                          sharpEdges={false}
                        >
                          {translation.of((tokens) => tokens.program.fork)}
                        </Button>
                      </>
                    ))
                    .exhaustive()
                }
              </S.ButtonGroup>
            </S.LeftControls>
            <S.MainControls>
              <S.ButtonGroup>
                <Button
                  size={SystemTokenSize.Small}
                  isDisabled={!isBuilt || buildInProgress || (currentFrameIdx === 0) || (2 > frameCount)}
                  onPress={() => programControlService.goToFirstFrame()}
                  icon={AiFillFastBackward}
                  iconLabel={translation.textOf((tokens) => tokens.program.snippet.removeSnippet)}
                  rounded="left"
                />
                <Button
                  size={SystemTokenSize.Small}
                  isDisabled={!isBuilt || buildInProgress || (currentFrameIdx === 0) || (2 > frameCount)}
                  onPress={() => programControlService.decrementFrame()}
                  icon={AiFillCaretLeft}
                  iconLabel={translation.textOf((tokens) => tokens.program.snippet.removeSnippet)}
                  rounded="no"
                />
                <Button
                  size={SystemTokenSize.Small}
                  isDisabled={!isBuilt || buildInProgress || (2 > frameCount)}
                  onPress={() => programControlService.toggleAutoplay()}
                  icon={autoplayEnabled ? AiFillPauseCircle : AiFillPlayCircle}
                  iconLabel={(
                    autoplayEnabled
                      ? translation.textOf((tokens) => (tokens.program.disableAutoplay))
                      : translation.textOf((tokens) => (tokens.program.enableAutoplay))
                  )}
                  rounded="no"
                />
                <Button
                  size={SystemTokenSize.Small}
                  isDisabled={!isBuilt || buildInProgress || (currentFrameIdx === frameCount - 1) || (2 > frameCount)}
                  onPress={() => programControlService.incrementFrame()}
                  icon={AiFillCaretRight}
                  iconLabel={translation.textOf((tokens) => tokens.program.snippet.removeSnippet)}
                  rounded="no"
                />
                <Button
                  size={SystemTokenSize.Small}
                  isDisabled={!isBuilt || buildInProgress || (currentFrameIdx === frameCount - 1) || (2 > frameCount)}
                  onPress={() => programControlService.goToLastFrame()}
                  icon={AiFillFastForward}
                  iconLabel={translation.textOf((tokens) => tokens.program.snippet.removeSnippet)}
                  rounded="right"
                />
              </S.ButtonGroup>
              <S.Progress
                $progress={progress}
                aria-label={translation.textOf((tokens) => tokens.program.progressPercentageLabel, progressPercentage)}
              />
            </S.MainControls>
            <S.RightControls>
              <S.ButtonGroup>
                <Button
                  isDisabled={buildInProgress || (autoplaySpeed === ProgramAutoplaySpeed.Slow)}
                  isSelected={autoplaySpeed === ProgramAutoplaySpeed.Slow}
                  onPress={() => programControlService.setAutoplaySpeed(ProgramAutoplaySpeed.Slow)}
                  icon={BsLightningFill}
                  rounded="left"
                  iconOpacity="0.33"
                />
                <Button
                  isDisabled={buildInProgress || (autoplaySpeed === ProgramAutoplaySpeed.Normal)}
                  isSelected={autoplaySpeed === ProgramAutoplaySpeed.Normal}
                  onPress={() => programControlService.setAutoplaySpeed(ProgramAutoplaySpeed.Normal)}
                  icon={BsLightningFill}
                  rounded="no"
                  iconOpacity="0.66"
                />
                <Button
                  isDisabled={buildInProgress || (autoplaySpeed === ProgramAutoplaySpeed.Fast)}
                  isSelected={autoplaySpeed === ProgramAutoplaySpeed.Fast}
                  onPress={() => programControlService.setAutoplaySpeed(ProgramAutoplaySpeed.Fast)}
                  icon={BsLightningFill}
                  rounded="right"
                />
              </S.ButtonGroup>
            </S.RightControls>
            <S.Visualizations>
              {props.visualizer}
            </S.Visualizations>
          </S.ControlsPanel>
        </S.ControlsBox>
      </S.ControlsWrapper>
      <S.Main ref={mainContentRef} $marginTopPx={controlsPanelHeightPx}>
        {props.main}
      </S.Main>
    </S.Wrapper>
  );
}
