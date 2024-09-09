import styled from "styled-components";
import { SerializedValue } from "~/components/app/Visualizer/SerializedValue/SerializedValue";

export const ValueList = styled.ol`
  list-style-type: none;
  display: table;
  border-collapse: collapse;
  position: relative;
  top: -0.5rem;
`;

export const ValueListElement = styled.li`
  display: table-cell;
  border: 1px solid ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.list.border};
  padding: 0.5rem;
  border-collapse: collapse;
  position: relative;
`;

export const ValueView = styled.div`

`;

export const ValueLabel = styled.span`
  position: absolute;
  left: 0;
  bottom: -1rem;
  width: 100%;
  text-align: center;
  font: ${({ theme }) => theme.tokens.system.common.typography.monospace.regular.xsmall};
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.list.index};
`;

export const Value = styled(SerializedValue)`
  font: ${({ theme }) => theme.tokens.system.common.typography.monospace.bold.medium};
`;

export const NoEntitiesText = styled.p`
  font: ${({ theme }) => theme.tokens.system.common.typography.display.large};
  color: ${({ theme }) => theme.tokens.dynamic.visualizer.color.entities.list.emptyList};
`;
