import React from "react";
import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import * as S from "~/components/app/ProgramReactions/ProgramReactions.styles";
import { useServerRequest } from "~/hooks/useServerRequest";

export interface ProgramReactionsProps {
  programId: string | undefined;
  positiveReactions: number,
  negativeReactions: number,
  userReaction: HttpContracts.ProgramReaction,
  onNewReactions(okResponse: HttpContracts.ReactOnProgramOkResponse): void;
}

export function ProgramReactions(props: ProgramReactionsProps) {
  const reactOnProgramRequest = useServerRequest(HttpContracts.reactOnProgramContract);

  const updateReaction = React.useCallback(async (reactionType: HttpContracts.ProgramReaction) => {
    if (props.programId === undefined) {
      return;
    }

    const response = await reactOnProgramRequest.execute(
      new HttpContracts.ReactOnProgramRequest(
        props.programId,
        reactionType,
      ),
    );

    props.onNewReactions(response.castOrThrow(StatusCodes.OK));
  }, [reactOnProgramRequest, props.programId, props.onNewReactions]);

  const handleReactionButtonClick = React.useCallback((reactionType: HttpContracts.ProgramReaction) => {
    const newReactionType = (reactionType === props.userReaction)
      ? HttpContracts.ProgramReaction.None
      : reactionType;

    updateReaction(newReactionType).then();
  }, [updateReaction, props.userReaction]);

  return (
    <S.Container>
      <S.ReactionButton
        isSelected={(props.userReaction === HttpContracts.ProgramReaction.Positive)}
        sharpEdges={true}
        rounded="left"
        icon={MdThumbUp}
        onPress={() => handleReactionButtonClick(HttpContracts.ProgramReaction.Positive)}
      >
        <>{props.positiveReactions}</>
      </S.ReactionButton>
      <S.ReactionButton
        isSelected={(props.userReaction === HttpContracts.ProgramReaction.Negative)}
        sharpEdges={true}
        rounded="right"
        icon={MdThumbDown}
        onPress={() => handleReactionButtonClick(HttpContracts.ProgramReaction.Negative)}
      >
        <>{props.negativeReactions}</>
      </S.ReactionButton>
    </S.Container>
  );
}
