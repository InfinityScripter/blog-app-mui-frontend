import {
  useContext,
  createContext,
  type ReactNode,
  type ComponentType,
} from "react";

// ----------------------------------------------------------------------

export function withLoadingProps<P extends Record<string, unknown>>(
  loader: (useLoadingProps: () => P) => ComponentType<P>,
): ComponentType<P> {
  const LoadingPropsContext = createContext<P>({} as P);

  const useLoadingProps = (): P => useContext(LoadingPropsContext);

  const DynamicComponent = loader(useLoadingProps);

  function WithLoadingPropsComponent(props: P): ReactNode {
    return (
      <LoadingPropsContext.Provider value={props}>
        <DynamicComponent {...props} />
      </LoadingPropsContext.Provider>
    );
  }

  return WithLoadingPropsComponent;
}
