import type { Theme } from "~/themes/Theme";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
