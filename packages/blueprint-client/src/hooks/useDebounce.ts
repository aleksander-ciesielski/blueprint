import * as React from "react";

export function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, ms);

    return () => clearTimeout(timeout);
  }, [value]);

  return debounced;
}
