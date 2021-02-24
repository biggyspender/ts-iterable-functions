import { IndexedSelector } from '../types/IndexedSelector'
import { getIdentity } from './helpers/getIdentity'
import { SetFactory } from "../types/SetFactory"

export function _toSet<T>(src: Iterable<T>, setFactory?: SetFactory<T>): Set<T>
export function _toSet<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  setFactory?: SetFactory<TKey>
): Set<TKey>
export function _toSet<T, TKey = T>(
  src: Iterable<T>,
  keySelectorOrSetFactory?: IndexedSelector<T, TKey> | SetFactory<TKey>,
  setFactoryMaybe?: SetFactory<TKey>
): Set<TKey> {
  const ks: IndexedSelector<T, TKey> = ((typeof keySelectorOrSetFactory === "function")
    ? keySelectorOrSetFactory
    : getIdentity()) as IndexedSelector<T, TKey>
  const setFactory = typeof keySelectorOrSetFactory === "object"
    ? keySelectorOrSetFactory
    : setFactoryMaybe
  const set = setFactory?.createSet() ?? new Set()
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

export function toSet<T>(setFactory?: SetFactory<T>): (src: Iterable<T>) => Set<T>
export function toSet<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  setFactory?: SetFactory<TKey>
): (src: Iterable<T>) => Set<TKey>
export function toSet<T, TKey = T>(
  keySelectorOrSetFactory?: IndexedSelector<T, TKey> | SetFactory<TKey>,
  setFactoryMaybe?: SetFactory<TKey>
): (src: Iterable<T>) => Set<TKey> {
  const ks: IndexedSelector<T, TKey> = (!(typeof keySelectorOrSetFactory === "object")
    ? keySelectorOrSetFactory
    : getIdentity()) as IndexedSelector<T, TKey>
  const setFactory = typeof keySelectorOrSetFactory === "object"
    ? keySelectorOrSetFactory
    : setFactoryMaybe

  return (src: Iterable<T>) => _toSet(src, ks, setFactory)
}
