import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";
import { SetFactory } from "../types/SetFactory";

export function _distinctBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  setFactory: SetFactory<TKey> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set = setFactory.createSet();
    let i = 0;
    for (const x of src) {
      const idx = i++;
      const key = selector(x, idx);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield x;
    }
  });
}

export const distinctBy = deferP0(_distinctBy);
