import styled from "styled-components";

export const Container = styled.span`
  &[data-type="undefined"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.undefined};
  }

  &[data-type="object"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.object};
  }

  &[data-type="number"], &[data-type="bigint"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.number};
  }

  &[data-type="string"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.string};
  }

  &[data-type="symbol"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.symbol};
  }

  &[data-type="function"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.function};
  }

  &[data-type="boolean"] {
    color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.scalar.boolean};
  }
`;
