import { deferP0 } from 'ts-functional-pipe'
import { headTail, toIterable } from '../ts-iterable-functions'

export function _scan<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut,
): Iterable<TOut>
export function _scan<T, TOut>(
  src: Iterable<T>,
  aggFunc: (prev: T, curr: T, idx: number) => T,
): Iterable<T>
export function _scan<T, TOut, TT extends T | TOut>(
  src: Iterable<T>,
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): Iterable<TT> {
  return toIterable(function* () {
    let v: TT;
    let s: Iterable<T>;
    if (typeof seed !== 'undefined') {
      v = seed
      s = src
    } else {
      const ht = headTail(src);
      v = ht[0] as TT;
      s = ht[1]
    }
    let i = 0
    for (const item of s) {
      v = aggFunc(v, item, i++)
      yield v as TT;
    }
  })

}
export function scan<T, TOut>(
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut,
  seed: TOut
): (source: Iterable<T>) => Iterable<TOut>
export function scan<T>(aggFunc: (prev: T, curr: T, idx: number) => T): (source: Iterable<T>) => Iterable<T>
export function scan<T, TOut, TT extends T | TOut>(
  aggFunc: (prev: TT, curr: T, idx: number) => TT,
  seed?: TT
): (source: Iterable<T>) => Iterable<TT> {
  return (source: Iterable<T>) => _scan(source, aggFunc, seed as TT)
}
