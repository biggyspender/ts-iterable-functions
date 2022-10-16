import { deferP0 } from "ts-functional-pipe";
import { _takeWhile } from "./takeWhile";

export function _take<T>(src: Iterable<T>, numItems: number): Iterable<T> {
  return _takeWhile(src, (_, i) => i < numItems);
}
export const take = deferP0(_take);
