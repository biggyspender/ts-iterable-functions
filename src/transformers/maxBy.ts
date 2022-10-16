import { Comparer, defaultComparer } from "ts-comparer-builder";
import { deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { _minMaxByImpl } from "./helpers/minMaxByImpl";

export function _maxBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey> = defaultComparer
): Iterable<T> {
  return _minMaxByImpl(src, selector, (a, b) => comparer(a, b));
}

export const maxBy = deferP0(_maxBy);
