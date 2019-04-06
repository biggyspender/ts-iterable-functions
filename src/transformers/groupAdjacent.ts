import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer } from 'ts-equality-comparer'
import { toIterable } from './toIterable'
import { deferP0 } from 'ts-functional-pipe'

export function _groupAdjacent<TSource, TKey, TElement, TResult>(
  src: Iterable<TSource>,
  keySelector: IndexedSelector<TSource, TKey>,
  elementSelector: IndexedSelector<TSource, TElement>,
  resultSelector: (key: TKey, items: Iterable<TElement>) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Iterable<TResult> {
  const source = src
  const eq = equalityComparer
    ? (a: TKey | undefined, b: TKey | undefined) =>
        typeof a !== 'undefined' && typeof b !== 'undefined' && equalityComparer.equals(a, b)
    : (a: TKey | undefined, b: TKey | undefined) =>
        typeof a !== 'undefined' && typeof b !== 'undefined' && a === b
  // nasty coverage edge-case whereby transformation to ES5 destroys istanbul comment, so we need to put
  // it on wider scope. ugh.a
  return toIterable(
    /* istanbul ignore next */ function*() {
      const iterator = source[Symbol.iterator]()

      let group: TKey | undefined = undefined
      let members: Array<TElement> | undefined = undefined

      let i = 0
      let itResult
      while (!(itResult = iterator.next()).done) {
        const idx = i++
        const key = keySelector(itResult.value, idx)
        const element = elementSelector(itResult.value, idx)
        if (typeof members !== 'undefined' && eq(group, key)) {
          members.push(element)
        } else {
          if (typeof members !== 'undefined' && typeof group !== 'undefined') {
            yield resultSelector(group, members)
          }
          group = key
          members = [element]
        }
      }
      if (typeof members !== 'undefined' && typeof group !== 'undefined') {
        yield resultSelector(group, members)
      }
    }
  )
}
export const groupAdjacent = deferP0(_groupAdjacent)
