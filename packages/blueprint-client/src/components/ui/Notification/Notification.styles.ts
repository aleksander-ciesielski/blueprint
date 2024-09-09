import styled from "styled-components";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";

const FADE_DURATION_MS = 200;

export const Container = styled.article<{ $lifespanMs: number }>`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  border-radius: 0.5rem;
  width: 32rem;
  padding: ${({ theme }) => theme.tokens.system.common.spacing.panel.xxlarge};
  display: flex;
  align-items: center;
  column-gap: 2rem;
  animation:
    ${FADE_DURATION_MS}ms linear 0ms 1 normal forwards running fadeIn,
    ${FADE_DURATION_MS}ms linear ${(props) => props.$lifespanMs - FADE_DURATION_MS}ms 1 normal forwards running fadeOut;
  
  &[data-appearance=success] {
    background-color: ${({ theme }) => theme.tokens.dynamic.notifications.color.icon.success};
  }

  &[data-appearance=danger] {
    background-color: ${({ theme }) => theme.tokens.dynamic.notifications.color.icon.danger};
  }
`;

export const NotificationIcon = styled(ReactIconsContextWrapper)`
  font-size: 1.5rem;
  align-self: flex-start;
  color: ${({ theme }) => theme.tokens.dynamic.notifications.color.text};
`;

export const Content = styled.p`
  font: ${({ theme }) => theme.tokens.system.common.typography.display.small};
  color: ${({ theme }) => theme.tokens.dynamic.notifications.color.text};
  word-break: break-word;
`;
