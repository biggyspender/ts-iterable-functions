import { defaultComparer, Comparer } from "ts-comparer-builder";
import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { first } from "./first";
import { minMaxByImpl } from "./helpers/minMaxByImpl";
import { map } from "./map";

export function _max<T, TOut = T>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut> = (x) => x as unknown as TOut,
  comparer: Comparer<TOut> = defaultComparer
): TOut | undefined {
  return pp(
    src,
    map(selector),
    minMaxByImpl(
      (x) => x,
      (a, b) => comparer(a, b)
    ),
    first()
  );
}

export const max = deferP0(_max);
