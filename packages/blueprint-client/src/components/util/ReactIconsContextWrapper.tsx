import * as React from "react";
import { IconContext } from "react-icons";

export interface ReactIconsContextWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export function ReactIconsContextWrapper(props: ReactIconsContextWrapperProps) {
  return (
    <IconContext.Provider value={{ className: props.className }}>
      {props.children}
    </IconContext.Provider>
  );
}
