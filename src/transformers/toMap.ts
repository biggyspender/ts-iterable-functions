import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer, isEqualityComparer } from 'ts-equality-comparer'
import { isIndexedSelector } from './helpers/isIndexedSelector'
import getIdentity from './helpers/getIdentity'
import { createComparerMap } from 'ts-hashmap'

export function _toMap<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, T>
export function _toMap<T, TKey, TValue>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, TValue>
export function _toMap<T, TKey, TValue = T>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, TValue> {
  const vs: IndexedSelector<T, TValue> = (isIndexedSelector(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : getIdentity()) as IndexedSelector<T, TValue>
  const eqCom = isEqualityComparer(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : equalityComparer

  const map = createComparerMap<TKey, TValue>(eqCom)
  let i = 0
  for (const x of src) {
    const key = keySelector(x, i++)
    if (map.has(key)) {
      throw Error('duplicate key')
    }
    map.set(key, vs(x, i))
  }
  return map
}

export function toMap<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, T>
export function toMap<T, TKey, TValue>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, TValue>
export function toMap<T, TKey, TValue = T>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, TValue> {
  const vs: IndexedSelector<T, TValue> = (isIndexedSelector(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : getIdentity()) as IndexedSelector<T, TValue>
  const eqCom = isEqualityComparer(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : equalityComparer
  return (src: Iterable<T>) => _toMap(src, keySelector, vs, eqCom)
}
