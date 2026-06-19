import {
  useContext,
  createContext,
  type ReactNode,
  type ComponentType,
} from "react";

// ----------------------------------------------------------------------

export function withLoadingProps<P extends object>(
  loader: (useLoadingProps: () => P) => ComponentType<P>,
): ComponentType<P> {
  const LoadingPropsContext = createContext<P | undefined>(undefined);

  const useLoadingProps = (): P => {
    const value = useContext(LoadingPropsContext);

    if (value === undefined) {
      throw new Error(
        "useLoadingProps must be used within its LoadingPropsContext provider",
      );
    }

    return value;
  };

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
