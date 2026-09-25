declare module "react-test-renderer" {
  import type { ReactElement } from "react";

  export interface ReactTestInstance {
    props: Record<string, unknown>;
    children: unknown;
    root: ReactTestInstance;
    toJSON: () => unknown;
    find: (predicate: (node: ReactTestInstance) => boolean) => ReactTestInstance;
    findAll: (predicate: (node: ReactTestInstance) => boolean) => ReactTestInstance[];
    findByProps: (props: Record<string, unknown>) => ReactTestInstance;
    findAllByProps: (props: Record<string, unknown>) => ReactTestInstance[];
    findByType: (type: unknown) => ReactTestInstance;
    findAllByType: (type: unknown) => ReactTestInstance[];
  }

  const TestRenderer: {
    create: (element: ReactElement) => ReactTestInstance;
  };

  export type { ReactTestInstance };
  export default TestRenderer;
}