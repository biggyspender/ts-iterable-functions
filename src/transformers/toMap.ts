import { IndexedSelector } from "../types/IndexedSelector";
import { MapFactory } from "../types/MapFactory";
import getIdentity from "./helpers/getIdentity";

/**
 * Materializes a sequence into a map keyed by the projected key selector.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TKey - Key type returned by `keySelector`.
 * @typeParam TValue - Value type stored in the resulting map when `valueSelector` is supplied.
 * @param src - Source iterable to materialize.
 * @param keySelector - Projection invoked with each element and index to produce the map key.
 * @param valueSelector - Optional projection producing the value that should be stored for the key; defaults to the element itself.
 * @param mapFactory - Optional factory controlling the concrete map implementation to instantiate.
 * @returns A map containing one entry per source element keyed by `keySelector`.
 * @throws {Error} If `keySelector` produces the same key more than once.
 * @example
 * ```ts
 * const byId = _toMap(
 *   [
 *     { id: 1, name: "Ada" },
 *     { id: 2, name: "Linus" },
 *   ],
 *   (person) => person.id,
 *   (person) => person.name
 * );
 * console.log(byId.get(2)); // "Linus"
 * ```
 */
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

/**
 * Curried version of {@link _toMap}.
 */
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
