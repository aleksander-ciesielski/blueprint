import styled from "styled-components";
import { Input } from "~/components/ui/Input/Input";
import { Button } from "~/components/ui/Button/Button";

export const Container = styled.div`
  width: 26rem;
  display: flex;
  flex-direction: column;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1.75rem;
`;

export const TextInput = styled(Input)`
  width: 100%;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 0;
`;

export const Separator = styled.span`
  width: 100%;
  display: block;
  height: 0.1rem;
  margin: 3rem 0;
  background-color: ${(props) => props.theme.tokens.dynamic.auth.color.separator};
`;

export const RegisterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RegisterSectionText = styled.p`
  font: ${(props) => props.theme.tokens.system.common.typography.display.medium};
  color: ${(props) => props.theme.tokens.dynamic.auth.color.text};
`;
