import { Provider } from "react-redux";
import * as React from "react";
import styled from "styled-components";
import type { AppProps } from "next/app";
import { store } from "~/store/store";
import { ProviderInitializer } from "~/components/ProviderInitializer";
import { GlobalStyles } from "~/components/GlobalStyles";
import "@fontsource/inter/600.css";
import "@fontsource/chakra-petch/300.css";
import "@fontsource/chakra-petch/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/600.css";
import "katex/dist/katex.min.css";
import { useSnippetService } from "~/hooks/snippets/useSnippetService";
import { Layout } from "~/components/layout/Layout";
import { Spinner } from "~/components/icons/Spinner";
import { ReactIconsContextWrapper } from "~/components/util/ReactIconsContextWrapper";
import { Logo } from "~/components/app/Logo/Logo";
import { rem } from "~/utilities/theme/rem";

const Loader = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.tokens.dynamic.surface.color.loader};
`;

const LoaderLogo = styled(Logo)`
  > * {
    font-size: ${rem(32)};
  }
`;

const LoaderIcon = styled(ReactIconsContextWrapper)`
  font-size: ${({ theme }) => theme.tokens.system.layout.size.spinner};
  color: ${({ theme }) => theme.tokens.dynamic.layout.color.spinner};
`;

export default function App(props: AppProps) {
  const { Component } = props;
  const [loading, setLoading] = React.useState(true);
  const snippetService = useSnippetService();

  React.useEffect(() => {
    snippetService?.init().then(() => {
      setLoading(false);
    });
  }, [snippetService]);

  React.useEffect(() => {
    document.body.classList.add("monaco-editor");
  }, []);

  const loader = (
    <Loader>
      <LoaderLogo />
      <LoaderIcon>
        <Spinner />
      </LoaderIcon>
    </Loader>
  );

  return (
    <Provider store={store}>
      <ProviderInitializer loader={loader}>
        <GlobalStyles />
        {
          loading
            ? loader
            : (
              <Layout>
                <Component {...props.pageProps} />
              </Layout>
            )
        }
      </ProviderInitializer>
    </Provider>
  );
}
