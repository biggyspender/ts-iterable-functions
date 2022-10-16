import { filter, _filter } from "./filter";

/**
 * creates a new sequence with every item of the source sequence for which the predicate function returns `true`
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _filter}
 * @alias of {@link filter}
 *
 * @param src source sequence
 * @param pred a function that returns `true` to signal inclusion, `false` to exclude
 * @returns a new (possibly shorter) sequence with some items filtered away
 */

export const where = filter;
/**
 * creates a new sequence with every item of the source sequence for which the predicate function returns `true`
 *
 * @alias of {@link _filter}
 * @param src source sequence
 * @param pred a function that returns `true` to signal inclusion, `false` to exclude
 * @returns a new (possibly shorter) sequence with some items filtered away
 */
export const _where = _filter;
