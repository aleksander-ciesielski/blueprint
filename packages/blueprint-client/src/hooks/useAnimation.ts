import * as React from "react";

export function useAnimation(animate: (delta: number) => void): void {
  const handleRef = React.useRef<number>();
  const lastTimeRef = React.useRef<number>();

  const loop = React.useCallback((now: number) => {
    if (lastTimeRef.current !== undefined) {
      animate(now - lastTimeRef.current);
    }

    lastTimeRef.current = now;
    handleRef.current = requestAnimationFrame(loop);
  }, []);

  React.useEffect(() => {
    handleRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handleRef.current!);
  }, [loop]);
}
