import Head from "next/head";
import * as React from "react";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import { useTranslation } from "~/hooks/translation/useTranslation";

export interface PageInfoProps {
  title: TextTokenSelector<[]>;
}

export function PageInfo(props: PageInfoProps) {
  const translation = useTranslation();

  return (
    <Head>
      <link rel="icon" href="/favicon.png" sizes="any" />
      <title>{translation.textOf(props.title)} | Blueprint</title>
    </Head>
  );
}
