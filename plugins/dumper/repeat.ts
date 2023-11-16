type Slice = { count: number; offset: number };
type SliceInfo = { count: number; offset: number; size: number };
type SliceConstraint = { count: number; items: unknown[] };

type RepeatableFunction<T extends SliceConstraint> = (
  parameters: Slice
) => Promise<T>;

export async function* repeat<T extends SliceConstraint>(
  function_: RepeatableFunction<T>,
  { batchSize = 100, offset = 0 } = {}
): AsyncGenerator<
  [items: T["items"], meta: SliceInfo & { stop(): void }, full: T]
> {
  let count = Number.POSITIVE_INFINITY;
  let stopCalled = false;

  for (let index = 0, o = offset + index * batchSize; o < count; ) {
    if (stopCalled) break;
    const response = await function_({ count: batchSize, offset: o });

    count = response.count;

    yield [
      response.items,
      {
        count,
        offset: o,
        size: batchSize,
        stop: () => {
          stopCalled = true;
        }
      },
      response
    ];
    index += 1;
    o = offset + index * batchSize;
  }
}

type Nxt = { start_from: string; count: number };
type NxtConstraint = { next_from?: string; items: unknown[] };
type NxtRepeatableFunction<T extends NxtConstraint> = (
  parameters: Nxt
) => Promise<T>;

export async function* nxtRepeat<T extends NxtConstraint>(
  function_: NxtRepeatableFunction<T>,
  { batchSize = 100, startFrom = "" } = {}
): AsyncGenerator<
  readonly [T["items"], { startFrom: string; batchSize: number }]
> {
  let end = false;

  while (!end) {
    const response = await function_({
      start_from: startFrom,
      count: batchSize
    });

    if (!response.next_from) {
      end = true;
      break;
    }

    startFrom = response.next_from;
    yield [response.items, { startFrom, batchSize }];
  }
}
