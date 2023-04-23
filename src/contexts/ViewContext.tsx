import { App } from "obsidian";
import { createContext } from "preact";
import { PropsWithChildren, useContext } from "preact/compat";

interface IViewContext {
  app: App;
}

interface IViewContextProviderProps extends PropsWithChildren {
  app: App;
}

const ViewContext = createContext<IViewContext | null>(null);

export default function ViewContextProvider(props: IViewContextProviderProps) {
  return (
    <ViewContext.Provider value={{ app: props.app }}>
      {props.children}
    </ViewContext.Provider>
  );
}

export function useViewContext() {
  const ctx = useContext(ViewContext);
  if (!ctx)
    throw new Error("Cannot use ViewContext outside ViewContextProvider");
  return ctx;
}

export function useApp() {
  return useViewContext().app;
}
