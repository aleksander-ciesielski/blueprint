import type { TextTokenDefinitions } from "~/translation/TextTokenDefinitions";
import type { TextToken } from "~/translation/TextToken";

export type TextTokenSelector<TArgs extends unknown[]> = (tokens: TextTokenDefinitions) => TextToken<TArgs>;
