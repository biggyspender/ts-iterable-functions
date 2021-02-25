import { IndexedPredicate } from '../types/IndexedPredicate'
import { deferP0 } from 'ts-functional-pipe'

/**
 * returns `true` if *any* elements in `src` return `true` when passed to `pred`
 * @remarks does not enumerate further if `pred` returns `false` on a value
 * @param src source sequence
 * @param pred indexed predicate function
 */
export function _some<T>(src: Iterable<T>, pred: IndexedPredicate<T> = (x) => true): boolean {
  let i = 0
  for (const item of src) {
    if (pred(item, i++)) {
      return true
    }
  }
  return false
}
/**
 * returns `true` if *any* elements in `src` return `true` when passed to `pred`
 * @remarks does not enumerate further if `pred` returns `false` on a value
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _every}
 * @param src source sequence
 * @param pred indexed predicate function
 */
export const some = deferP0(_some)
