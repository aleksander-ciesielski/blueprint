import styled from "styled-components";
import { SerializedValue } from "~/components/app/Visualizer/SerializedValue/SerializedValue";

export const Value = styled(SerializedValue)`
  font: ${({ theme }) => theme.tokens.system.common.typography.monospace.bold.xxlarge};
`;
