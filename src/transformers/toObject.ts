import { deferP0, pipeInto } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { map } from "./map";

export function _toObject<T, K extends PropertyKey, V>(
  arr: Iterable<T>,
  keySelector: IndexedSelector<T, K>,
  valueSelector: IndexedSelector<T, V>
) {
  return pipeInto(
    arr,
    map((v, i) => [keySelector(v, i), valueSelector(v, i)] as const),
    (v) => Object.fromEntries(v) as Record<K, V>
  );
}

export const toObject = deferP0(_toObject);
