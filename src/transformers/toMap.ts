import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import getIdentity from "./helpers/getIdentity";

export function _toMap<T, TKey>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): Map<TKey, T>;
export function _toMap<T, TKey, TValue>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  mapFactory?: MapFactory<TKey>
): Map<TKey, TValue>;
export function _toMap<T, TKey, TValue = T>(
  src: Iterable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrMapFactory?: IndexedSelector<T, TValue> | MapFactory<TKey>,
  mapFactoryMaybe?: MapFactory<TKey>
): Map<TKey, TValue> {
  const vs: IndexedSelector<T, TValue> = (
    !(typeof valueSelectorOrMapFactory === "object")
      ? valueSelectorOrMapFactory
      : getIdentity()
  ) as IndexedSelector<T, TValue>;
  const mapFactory =
    typeof valueSelectorOrMapFactory === "object"
      ? valueSelectorOrMapFactory
      : mapFactoryMaybe;

  const map = mapFactory?.createMap<TValue>() ?? new Map<TKey, TValue>();
  let i = 0;
  for (const x of src) {
    const key = keySelector(x, i++);
    if (map.has(key)) {
      throw Error("duplicate key");
    }
    map.set(key, vs(x, i));
  }
  return map;
}

export function toMap<T, TKey>(
  keySelector: IndexedSelector<T, TKey>,
  mapFactory?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, T>;
export function toMap<T, TKey, TValue>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  mapFactory?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, TValue>;
export function toMap<T, TKey, TValue = T>(
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrMapFactory?: IndexedSelector<T, TValue> | MapFactory<TKey>,
  mapFactoryMaybe?: MapFactory<TKey>
): (src: Iterable<T>) => Map<TKey, TValue> {
  const vs: IndexedSelector<T, TValue> = (
    !(typeof valueSelectorOrMapFactory === "object")
      ? valueSelectorOrMapFactory
      : getIdentity()
  ) as IndexedSelector<T, TValue>;
  const eqCom =
    typeof valueSelectorOrMapFactory === "object"
      ? valueSelectorOrMapFactory
      : mapFactoryMaybe;
  return (src: Iterable<T>) => _toMap(src, keySelector, vs, eqCom);
}
