import { deferP0 } from 'ts-functional-pipe'
import { IndexedPredicate } from '../types/IndexedPredicate'

/**
 * count the number of items in a sequence (that optionally satisfy a predicate)
 * @param src source sequence
 * @param pred optional predicate function to indicate which values should be included in the count
 */
export function _count<T>(src: Iterable<T>, pred: IndexedPredicate<T> = () => true): number {
  let c = 0
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      ++c
    }
  }
  return c
}
/**
 * count the number of items in a sequence (that optionally satisfy a predicate)
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _count}
 * @param src source sequence
 * @param pred optional predicate function to indicate which values should be included in the count
 */
export const count = deferP0(_count)
