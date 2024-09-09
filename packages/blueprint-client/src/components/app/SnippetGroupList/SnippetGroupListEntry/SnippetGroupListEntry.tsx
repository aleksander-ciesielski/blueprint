import { match } from "ts-pattern";
import * as React from "react";
import { nanoid } from "@reduxjs/toolkit";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import { SourceSnippet } from "~/components/app/Snippet/SourceSnippet/SourceSnippet";
import { VisualizationSnippet } from "~/components/app/Snippet/VisualizationSnippet/VisualizationSnippet";
import { SnippetType } from "~/entities/snippet/Snippet";
import * as S from "~/components/app/SnippetGroupList/SnippetGroupListEntry/SnippetGroupListEntry.styles";
import { MarkdownSnippet } from "~/components/app/Snippet/MarkdownSnippet/MarkdownSnippet";

export interface SnippetGroupListEntryProps {
  snippetGroup: SnippetGroup;
  readOnly: boolean;
  showControls: boolean;
  showVisualizerSnippets: boolean;
}

function createLinkElement(
  current: SnippetType,
  next: SnippetType,
): React.ReactNode {
  if (current === SnippetType.Source && next === SnippetType.Visualizer) {
    return <S.LeftToRightLink aria-hidden={true} />;
  }

  if (current === SnippetType.Visualizer && next === SnippetType.Source) {
    return <S.RightToLeftLink aria-hidden={true} />;
  }

  if (current === SnippetType.Visualizer && next === SnippetType.Visualizer) {
    return <S.RightToRightLink aria-hidden={true} />;
  }

  if (current === SnippetType.Source && next === SnippetType.Source) {
    return <S.LeftToLeftLink aria-hidden={true} />;
  }

  return null;
}

function transformSnippetGroup(snippetGroup: SnippetGroup): SnippetGroup {
  const sourceSnippets = snippetGroup.children
    .filter((snippet) => (snippet.type === SnippetType.Source));

  if (sourceSnippets.length === 0) {
    return snippetGroup;
  }

  return {
    id: snippetGroup.id,
    children: [sourceSnippets.reduce((acc, x, idx) => {
      const previousSourceSnippet = sourceSnippets[idx - 1];
      const previousCharacterOffset = (previousSourceSnippet === undefined)
        ? 0
        : acc.aliasCharacterOffset[previousSourceSnippet.id] ?? 0;

      const previousSourceSnippetLength = previousSourceSnippet?.code.length ?? 0;

      return {
        id: nanoid(),
        offset: sourceSnippets[0]?.offset ?? 0,
        aliasIds: [...acc.aliasIds, x.id],
        aliasCharacterOffset: {
          ...acc.aliasCharacterOffset,
          [x.id]: previousCharacterOffset + previousSourceSnippetLength + 4,
        },
        type: SnippetType.Source,
        code: [acc.code, x.code].join("\n\n"),
      };
    })],
  };
}

export function SnippetGroupListEntry(props: SnippetGroupListEntryProps) {
  const snippetGroup = React.useMemo(() => (
    (props.showVisualizerSnippets)
      ? props.snippetGroup
      : transformSnippetGroup(props.snippetGroup)
  ), [props.snippetGroup, props.showVisualizerSnippets]);

  return (
    <S.Container>
      <S.Snippets>
        {
          (snippetGroup.children.map((child, idx) => (
            <React.Fragment key={child.id}>
              {
                match(child.type)
                  .with(SnippetType.Source, () => (
                    <SourceSnippet
                      groupId={snippetGroup.id}
                      snippetId={child.id}
                      readOnly={props.readOnly}
                      showControls={props.showControls}
                      overrideSnippet={props.showVisualizerSnippets ? undefined : snippetGroup.children[0]!}
                    />
                  ))
                  .with(SnippetType.Visualizer, () => (
                    <VisualizationSnippet
                      groupId={snippetGroup.id}
                      snippetId={child.id}
                      readOnly={props.readOnly}
                      showControls={props.showControls}
                    />
                  ))
                  .with(SnippetType.Markdown, () => (
                    <MarkdownSnippet
                      groupId={snippetGroup.id}
                      snippetId={child.id}
                      readOnly={props.readOnly}
                      showControls={props.showControls}
                    />
                  ))
                  .exhaustive()
              }
              {(idx !== snippetGroup.children.length - 1) && createLinkElement(
                child.type,
                snippetGroup.children[idx + 1]!.type,
              )}
            </React.Fragment>
          )))
        }
      </S.Snippets>
    </S.Container>
  );
}
