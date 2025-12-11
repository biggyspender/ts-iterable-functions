import { pipeInto as pp } from "ts-functional-pipe";
import { map } from "../transformers/map";
import { range } from "./range";
/**
 * Creates an iterable by calling a generator function a specified number of times.
 *
 * @template T The type of the generated items.
 * @param {(i: number) => T} generator The function to generate each item.
 * @param {number} numRepeats The number of times to call the generator.
 * @returns {Iterable<T>} An iterable of generated items.
 */
export function repeatGenerate<T>(
  generator: (i: number) => T,
  numRepeats: number,
): Iterable<T> {
  return pp(
    range(0, numRepeats),
    map((i: number) => generator(i)),
  );
}
