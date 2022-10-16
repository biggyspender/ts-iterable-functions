import { deferP0 } from "ts-functional-pipe";

export function _aggregate<T, TOut>(
  src: Iterable<T>,
  seed: TOut,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut
): TOut {
  let v = seed;
  let i = 0;
  for (const item of src) {
    v = aggFunc(v, item, i++);
  }
  return v;
}
export const aggregate = deferP0(_aggregate);
