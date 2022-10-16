import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

export function _zipAllToTuple<T extends readonly unknown[]>(
  src: Iterablified<T>
): Iterable<T> {
  return toIterable(function* () {
    const iterators = src.map((iterable) =>
      iterable[Symbol.iterator]()
    ) as unknown as Iteratorfied<T>;
    for (;;) {
      const itRes = iterators.map((it) =>
        it.next()
      ) as unknown as IteratorResultified<T>;
      if (itRes.some((r) => r.done)) {
        break;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const v = itRes.map((r) => r.value) as unknown as T;
      yield v;
    }
  });
}

export const zipAllToTuple = deferP0(_zipAllToTuple);

export type Iterablified<T extends readonly unknown[]> = {
  [P in keyof T]: Iterable<T[P]>;
};
type Iteratorfied<T extends readonly unknown[]> = {
  [P in keyof T]: Iterator<T[P]>;
};
type IteratorResultified<T extends readonly unknown[]> = {
  [P in keyof T]: IteratorResult<T[P]>;
};
