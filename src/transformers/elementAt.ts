import { deferP0 } from "ts-functional-pipe";
import { _single } from "./single";

/**
 * Returns the element at the specified zero-based index from the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param index - Zero-based index of the element to retrieve.
 * @returns The value found at `index`.
 * @throws Error When the iterable does not contain an element at the requested index.
 *
 * @example
 * ```ts
 * const third = _elementAt(["a", "b", "c", "d"], 2);
 * console.log(third); // "c"
 * ```
 *
 * or using the curried version:
 * ```ts
 * const third = pipeInto(["a", "b", "c", "d"], elementAt(2));
 * console.log(third); // "c"
 * ```
 */
export function _elementAt<T>(src: Iterable<T>, index: number): T {
  return _single(src, (_, i) => i === index);
}

/**
 * Curried version of {@link _elementAt}.
 */
export const elementAt = deferP0(_elementAt);
