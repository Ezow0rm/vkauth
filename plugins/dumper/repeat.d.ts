declare type Slice = {
  count: number;
  offset: number;
};
declare type SliceInfo = {
  count: number;
  offset: number;
  size: number;
};
declare type SliceConstraint = {
  count: number;
  items: unknown[];
};
declare type RepeatableFunction<T extends SliceConstraint> = (
  parameters: Slice
) => Promise<T>;
export declare function repeat<T extends SliceConstraint>(
  function_: RepeatableFunction<T>,
  {
    batchSize,
    offset
  }?: {
    batchSize?: number;
    offset?: number;
  }
): AsyncGenerator<
  [
    items: T["items"],
    meta: SliceInfo & {
      stop(): void;
    },
    full: T
  ]
>;
declare type Nxt = {
  start_from: string;
  count: number;
};
declare type NxtConstraint = {
  next_from?: string;
  items: unknown[];
};
declare type NxtRepeatableFunction<T extends NxtConstraint> = (
  parameters: Nxt
) => Promise<T>;
export declare function nxtRepeat<T extends NxtConstraint>(
  function_: NxtRepeatableFunction<T>,
  {
    batchSize,
    startFrom
  }?: {
    batchSize?: number;
    startFrom?: string;
  }
): AsyncGenerator<
  readonly [
    T["items"],
    {
      startFrom: string;
      batchSize: number;
    }
  ]
>;
export {};
