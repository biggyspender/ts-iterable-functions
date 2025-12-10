import { every, _every } from "./every";

/**
 * returns `true` if *all* elements in `src` return `true` when passed to `pred`
 * @remarks
 * {@link https://biggyspender.github.io/ts-functional-pipe/globals.html#deferp0 P0 deferred} version of {@link _every}
 * @alias of {@link every}
 * @param src source sequence
 * @param pred indexed predicate function
 */
export const all = every;
/**
 * {@inheritDoc _every}
 */
export const _all = _every;
