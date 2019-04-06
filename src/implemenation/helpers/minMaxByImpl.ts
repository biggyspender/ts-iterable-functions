import { IndexedSelector } from '../../types/IndexedSelector'
import { Comparer } from 'ts-comparer-builder'
import { deferP0 } from 'ts-functional-pipe'

export function _minMaxByImpl<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey>
): Iterable<T> {
  let currentBestKey: TKey | undefined
  let currentBest: T[] = []
  let i = 0
  for (const item of src) {
    const idx = i++
    const key = selector(item, idx)
    if (typeof currentBestKey === 'undefined') {
      currentBest.push(item)
      currentBestKey = key
    } else {
      const comparison = comparer(key, currentBestKey)
      if (comparison > 0) {
        currentBest = [item]
        currentBestKey = key
      } else if (comparison === 0) {
        currentBest.push(item)
      }
    }
  }
  if (currentBest.length === 0) {
    throw Error('sequence contains no elements')
  }

  return currentBest
}
export const minMaxByImpl = deferP0(_minMaxByImpl)
