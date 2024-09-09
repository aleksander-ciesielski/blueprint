import type { TextTokenDefinitions } from "~/translation/TextTokenDefinitions";
import type { TextTokenSelector } from "~/translation/TextTokenSelector";

export interface Translation {
  id: string;
  name: TextTokenSelector<[]>;
  tags: string[];
  tokens: TextTokenDefinitions;
}
