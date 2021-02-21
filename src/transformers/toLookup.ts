import { IndexedSelector } from '../types/IndexedSelector'
import { MapFactory } from "../types/MapFactory"


export function _toLookup<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): Map<TKey, Iterable<T>>
export function _toLookup<T, TKey, TValue>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  mapFactory?: MapFactory<TKey>
): Map<TKey, Iterable<TValue>>
export function _toLookup<T, TKey, TValue = T>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrMapFactory?: IndexedSelector<T, TValue> | MapFactory<TKey>,
  mapFactoryMaybe?: MapFactory<TKey>
): Map<TKey, Iterable<T|TValue>> {
  let mapFactory: MapFactory<TKey> | undefined

  let valueSelector: IndexedSelector<T, TValue> | undefined
  if (typeof valueSelectorOrMapFactory === "object") {
    mapFactory = valueSelectorOrMapFactory
  } else {
    mapFactory = mapFactoryMaybe
    if (typeof valueSelectorOrMapFactory === "function") {
      valueSelector = valueSelectorOrMapFactory
    }
  }
  let mapFac: () => Map<TKey,Iterable<T|TValue>> = mapFactory?.createMap ?? (()=> new Map());

  const vs: (v: T, i: number) => T|TValue = valueSelector ?? (x => x)

  const map: Map<TKey, Iterable<T | TValue>> = mapFac()
  let i = 0
  for (const item of src) {
    let currentIdx = i++
    const key = keySelector(item, currentIdx)
    let arr: Array<T | TValue>
    arr = (map.get(key) as Array<T | TValue>) || new Array<T | TValue>()
    map.set(key, arr)
    arr.push(vs(item, currentIdx))
  }
  return map
}

export function toLookup<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<T>>
export function toLookup<T, TKey, TValue>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  mapFactory?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<TValue>>
export function toLookup<T, TKey, TValue = T>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrMapFactory?: IndexedSelector<T, TValue> | MapFactory<TKey>,
  mapFactoryMaybe?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, Iterable<T | TValue>> {
  let mapFactory: MapFactory<TKey> | undefined

  let valueSelector: IndexedSelector<T, TValue> | undefined
  if (typeof valueSelectorOrMapFactory === "object") {
    mapFactory = valueSelectorOrMapFactory
  } else {
    mapFactory = mapFactoryMaybe
    if (typeof valueSelectorOrMapFactory === "function") {
      valueSelector = valueSelectorOrMapFactory
    }
  }

  return valueSelector
    ? src => _toLookup(src, keySelector, valueSelector!, mapFactory)
    : src => _toLookup(src, keySelector, mapFactory)
}
