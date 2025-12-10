import { deferP0 } from "ts-functional-pipe";

/**
 * Executes the provided action for each element in the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable enumerated to supply values to `action`.
 * @param action - Callback invoked with the current value and index for its side effects.
 * @returns `void` after running the action against every item from the source.
 *
 * @example
 * ```ts
 * const log: Array<[number, number]> = [];
 * _forEach([10, 20], (value, index) => {
 *   log.push([value, index]);
 * });
 * console.log(log); // [[10, 0], [20, 1]]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const log: string[] = [];
 * pipeInto(
 *   ["a", "b"],
 *   forEach((value, index) => {
 *     log.push(`${index}:${value}`);
 *   })
 * );
 * console.log(log); // ["0:a", "1:b"]
 * ```
 */
export function _forEach<T>(
  src: Iterable<T>,
  action: (x: T, i: number) => void
): void {
  let i = 0;
  for (const x of src) {
    const currentIdx = i++;
    action(x, currentIdx);
  }
}

/**
 * Curried version of {@link _forEach}.
 */
export const forEach = deferP0(_forEach);
