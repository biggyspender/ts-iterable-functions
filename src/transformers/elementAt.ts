import { deferP0 } from "ts-functional-pipe";
import { _single } from "./single";

export function _elementAt<T>(src: Iterable<T>, index: number): T {
  return _single(src, (_, i) => i === index);
}

export const elementAt = deferP0(_elementAt);
