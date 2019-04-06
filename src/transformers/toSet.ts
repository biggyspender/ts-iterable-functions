import { EqualityComparer, isEqualityComparer } from 'ts-equality-comparer'
import { IndexedSelector } from '../types/IndexedSelector'
import { isIndexedSelector } from './helpers/isIndexedSelector'
import getIdentity from './helpers/getIdentity'
import { createComparerSet } from 'ts-hashmap'

export function _toSet<T>(src: Iterable<T>, equalityComparer?: EqualityComparer<T>): Set<T>
export function _toSet<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Set<TKey>
export function _toSet<T, TKey = T>(
  src: Iterable<T>,
  keySelectorOrEqualityComparer?: IndexedSelector<T, TKey> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Set<TKey> {
  const ks: IndexedSelector<T, TKey> = (isIndexedSelector(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : getIdentity()) as IndexedSelector<T, TKey>
  const eqCom = isEqualityComparer(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : equalityComparer
  const set = createComparerSet<TKey>(eqCom)
  let i = 0
  for (const x of src) {
    const key = ks(x, i++)
    if (set.has(key)) {
      throw Error('duplicate key')
    }
    set.add(key)
  }
  return set
}

export function toSet<T>(equalityComparer?: EqualityComparer<T>): (src: Iterable<T>) => Set<T>
export function toSet<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Set<TKey>
export function toSet<T, TKey = T>(
  keySelectorOrEqualityComparer?: IndexedSelector<T, TKey> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Set<TKey> {
  const ks: IndexedSelector<T, TKey> = (isIndexedSelector(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : getIdentity()) as IndexedSelector<T, TKey>
  const eqCom = isEqualityComparer(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : equalityComparer

  return (src: Iterable<T>) => _toSet(src, ks, eqCom)
}
