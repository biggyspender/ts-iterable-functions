import { headTail } from "../helpers/headTail";
import { _aggregate } from "./aggregate";

export function _reduce<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): TOut;
export function _reduce<T>(
  src: Iterable<T>,
  aggFunc: (prev: T, curr: T, idx: number) => T
): T;
export function _reduce<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): TT {
  if (typeof seed !== "undefined") {
    return _aggregate(src, seed, aggFunc);
  } else {
    const [head, tail] = headTail(src);
    return _aggregate(tail, head as unknown as TT, aggFunc);
  }
}

export function reduce<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): (source: Iterable<T>) => TOut;
export function reduce<T>(
  aggFunc: (prev: T, curr: T, idx: number) => T
): (source: Iterable<T>) => T;
export function reduce<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): (source: Iterable<T>) => TT {
  return (source: Iterable<T>) => _reduce(source, aggFunc, seed as TT);
}
