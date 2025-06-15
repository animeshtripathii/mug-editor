
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': {
      url: string;
      style?: React.CSSProperties;
      loading?: 'lazy' | 'eager';
      'events-target'?: string;
      [key: string]: any;
    };
  }
}
