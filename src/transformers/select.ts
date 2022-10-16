import { map, _map } from "./map";

/**
 * Creates a new sequence populated with the results of calling a provided function on every element in the source sequence
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _map}
 * @alias of {@link map}
 * @param src source sequence
 * @param selector function to transform each item `T` in the source sequence into `TOut`
 * @returns A new sequence with each element being the result of the selector function.
 */

export const select = map;
/**
 * Creates a new sequence populated with the results of calling a provided function on every element in the source sequence
 * @alias of {@link _map}
 * @param src source sequence
 * @param selector function to transform each item `T` in the source sequence into `TOut`
 * @returns A new sequence with each element being the result of the selector function.
 */
export const _select = _map;
