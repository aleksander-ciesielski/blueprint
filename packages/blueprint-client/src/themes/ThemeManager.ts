import type { Monaco } from "@monaco-editor/react";
import type { Theme } from "~/themes/Theme";
import { lightTheme } from "~/themes/themes/lightTheme";
import { darkTheme } from "~/themes/themes/darkTheme";
import { NullStorage } from "~/entities/NullStorage";

export class ThemeManager {
  public static readonly DEFAULT_THEME: Theme = lightTheme;

  private static readonly STORAGE_THEME_ID_KEY = "theme";
  private static readonly THEMES: Theme[] = [
    lightTheme,
    darkTheme,
  ];

  private static instance: ThemeManager | undefined;

  public static getInstance(): ThemeManager {
    if (ThemeManager.instance === undefined) {
      const storage = (typeof window === "undefined")
        ? new NullStorage()
        : localStorage;

      ThemeManager.instance = new ThemeManager(storage);
    }

    return ThemeManager.instance;
  }

  private constructor(
    private readonly storage: Storage,
  ) {}

  public read(): Theme {
    const id = this.storage.getItem(ThemeManager.STORAGE_THEME_ID_KEY);
    if (id === null) {
      return ThemeManager.DEFAULT_THEME;
    }

    return ThemeManager.THEMES.find(
      (theme) => (theme.id === id),
    ) ?? ThemeManager.DEFAULT_THEME;
  }

  public getById(id: string): Theme {
    const theme = ThemeManager.THEMES.find((item) => (item.id === id));
    if (theme === undefined) {
      throw new Error(`Could not find theme by the id "${id}".`);
    }

    return theme;
  }

  public write(theme: Theme): void {
    const themeOrDefault = ThemeManager.THEMES.find((item) => (item.id === theme.id)) ?? ThemeManager.DEFAULT_THEME;
    this.storage.setItem(ThemeManager.STORAGE_THEME_ID_KEY, themeOrDefault.id);
  }

  public register(monaco: Monaco): void {
    ThemeManager.THEMES.forEach((theme) => {
      monaco.editor.defineTheme(theme.id, theme.editor);
    });
  }
}
