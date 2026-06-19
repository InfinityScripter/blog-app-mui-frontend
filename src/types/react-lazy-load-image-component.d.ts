// Ambient typings for `react-lazy-load-image-component`.
// The package ships no declaration file and there is no @types package, so we
// declare its public surface here to satisfy `noImplicitAny` without casts.
declare module "react-lazy-load-image-component" {
  import type {
    ReactElement,
    ComponentType,
    HTMLAttributes,
    ImgHTMLAttributes,
  } from "react";

  export interface LazyLoadImageProps
    extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
    afterLoad?: () => void;
    beforeLoad?: () => void;
    delayMethod?: "debounce" | "throttle";
    delayTime?: number;
    effect?: string;
    placeholder?: ReactElement;
    placeholderSrc?: string;
    threshold?: number;
    useIntersectionObserver?: boolean;
    visibleByDefault?: boolean;
    wrapperClassName?: string;
    wrapperProps?: HTMLAttributes<HTMLSpanElement>;
    scrollPosition?: { x: number; y: number };
    onLoad?: ImgHTMLAttributes<HTMLImageElement>["onLoad"];
  }

  export const LazyLoadImage: ComponentType<LazyLoadImageProps>;

  export interface LazyLoadComponentProps {
    afterLoad?: () => void;
    beforeLoad?: () => void;
    delayMethod?: "debounce" | "throttle";
    delayTime?: number;
    placeholder?: ReactElement;
    threshold?: number;
    useIntersectionObserver?: boolean;
    visibleByDefault?: boolean;
    scrollPosition?: { x: number; y: number };
  }

  export const LazyLoadComponent: ComponentType<LazyLoadComponentProps>;

  export function trackWindowScroll<P>(component: P): P;
}
