import { IndexedSelector } from '../types/IndexedSelector'
import { EqualityComparer, isEqualityComparer } from 'ts-equality-comparer'
import { createComparerMap } from 'ts-hashmap'

const isValueSelector = <T, TValue>(obj: any): obj is IndexedSelector<T, TValue> =>
  typeof obj === 'function'

export function _toLookup<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, Iterable<T>>
export function _toLookup<T, TKey, TValue>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, Iterable<TValue>>
export function _toLookup<T, TKey, TValue = TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Map<TKey, Iterable<T | TValue>> {
  let comparer: EqualityComparer<TKey> | undefined
  let valueSelector: IndexedSelector<T, TValue> | undefined
  if (isEqualityComparer(valueSelectorOrEqualityComparer)) {
    comparer = valueSelectorOrEqualityComparer
  } else {
    comparer = equalityComparer
    if (isValueSelector<T, TValue>(valueSelectorOrEqualityComparer)) {
      valueSelector = valueSelectorOrEqualityComparer
    }
  }

  const vs: (v: T, i: number) => T | TValue = valueSelector || (x => x)

  const map: Map<TKey, Array<T | TValue>> = createComparerMap(comparer)
  let i = 0
  for (const item of src) {
    let currentIdx = i++
    const key = keySelector(item, currentIdx)
    let arr: Array<T | TValue>
    arr = map.get(key) || new Array<T | TValue>()
    map.set(key, arr)
    arr.push(vs(item, currentIdx))
  }
  return map
}

export function toLookup<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<T>>
export function toLookup<T, TKey, TValue>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<TValue>>
export function toLookup<T, TKey, TValue = TKey>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<T | TValue>> {
  let comparer: EqualityComparer<TKey> | undefined
  let valueSelector: IndexedSelector<T, TValue> | undefined
  if (isEqualityComparer(valueSelectorOrEqualityComparer)) {
    comparer = valueSelectorOrEqualityComparer
  } else {
    comparer = equalityComparer
    if (isValueSelector<T, TValue>(valueSelectorOrEqualityComparer)) {
      valueSelector = valueSelectorOrEqualityComparer
    }
  }
  return valueSelector
    ? src => _toLookup(src, keySelector, valueSelector!, comparer)
    : src => _toLookup(src, keySelector, comparer)
}
