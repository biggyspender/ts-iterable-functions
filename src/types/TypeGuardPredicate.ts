/**
 * Represents a predicate function that both narrows the type of its input and tracks the element index.
 *
 * @typeParam T - The broader type of the value being evaluated.
 * @typeParam S - The narrower subtype asserted when the predicate returns `true`.
 * @param x - The value under test, belonging to the broader type `T`.
 * @param i - The zero-based index of the value within the source iterable.
 * @returns A type guard asserting that `x` is of subtype `S`.
 */
export type TypeGuardPredicate<T, S extends T> = (x: T, i: number) => x is S;
