import { pipeInto as pp } from "ts-functional-pipe";
import { map } from "../transformers/map";
import { range } from "./range";
/**
 * Creates an iterable that repeats a given item a specified number of times.
 *
 * @template T The type of the item.
 * @param {T} item The item to repeat.
 * @param {number} numRepeats The number of times to repeat the item.
 * @returns {Iterable<T>} An iterable of repeated items.
 */
export function repeat<T>(item: T, numRepeats: number): Iterable<T> {
  return pp(
    range(0, numRepeats),
    map(() => item),
  );
}
