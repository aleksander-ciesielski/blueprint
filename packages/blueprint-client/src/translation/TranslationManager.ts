import innerText from "react-innertext";
import type { Translation } from "~/translation/Translation";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";
import type * as React from "react";
import { enUK } from "~/translation/translations/en-UK";
import { NullStorage } from "~/entities/NullStorage";
import { plPL } from "~/translation/translations/pl-PL";

export class TranslationManager {
  public static readonly DEFAULT_TRANSLATION: Translation = enUK;

  private static readonly STORAGE_TRANSLATION_ID_KEY = "lang";
  private static readonly TRANSLATIONS: Translation[] = [
    enUK,
    plPL,
  ];

  private static instance: TranslationManager;

  public static getInstance(): TranslationManager {
    if (TranslationManager.instance === undefined) {
      const storage = (typeof window === "undefined")
        ? new NullStorage()
        : localStorage;

      TranslationManager.instance = new TranslationManager(storage);
    }

    return TranslationManager.instance;
  }

  public constructor(
    private readonly storage: Storage,
  ) {}

  public getById(id: string): Translation {
    const translation = TranslationManager.TRANSLATIONS.find((item) => (item.id === id));
    if (translation === undefined) {
      throw new Error(`Could not find translation by the id "${id}".`);
    }

    return translation;
  }

  public read(): Translation {
    const id = this.storage.getItem(TranslationManager.STORAGE_TRANSLATION_ID_KEY);
    if (id === null) {
      return TranslationManager.DEFAULT_TRANSLATION;
    }

    return TranslationManager.TRANSLATIONS.find(
      (translation) => (translation.id === id),
    ) ?? TranslationManager.DEFAULT_TRANSLATION;
  }

  public write(translation: Translation): void {
    const translationOrDefault = TranslationManager.TRANSLATIONS.find(
      (item) => (item.id === translation.id),
    ) ?? TranslationManager.DEFAULT_TRANSLATION;

    this.storage.setItem(TranslationManager.STORAGE_TRANSLATION_ID_KEY, translationOrDefault.id);
  }

  public of<const TTokenArgs extends unknown[]>(
    selector: TextTokenSelector<TTokenArgs>,
    ...args: TTokenArgs
  ): React.ReactNode {
    const token = selector(this.read().tokens);
    return token(...args);
  }

  public textOf<const TTokenArgs extends unknown[]>(
    selector: TextTokenSelector<TTokenArgs>,
    ...args: TTokenArgs
  ): string {
    const token = selector(this.read().tokens);
    return innerText(token(...args));
  }
}
