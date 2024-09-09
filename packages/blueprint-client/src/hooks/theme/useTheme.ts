import { useSelector } from "~/store/store";
import { ThemeManager } from "~/themes/ThemeManager";

export function useTheme() {
  return useSelector((state) => ThemeManager.getInstance().getById(state.theme.current));
}
