import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { _indexed } from "./indexed";

export function _first<T>(src: Iterable<T>, pred?: IndexedPredicate<T>): T {
  for (const [v, i] of _indexed(src)) {
    if (!pred || pred(v, i)) {
      return v;
    }
  }
  throw Error("sequence contains no elements");
}

export const first = deferP0(_first);
