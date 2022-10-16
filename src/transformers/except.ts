import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { SetFactory } from "../types/SetFactory";
import { _filter } from "./filter";

export function _except<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set: Set<T> = setFactory.createSet();
    for (const item of seq) {
      set.add(item);
    }
    const outputValues = _filter(src, (item) => !set.has(item));
    for (const v of outputValues) {
      yield v;
    }
  });
}

export const except = deferP0(_except);
