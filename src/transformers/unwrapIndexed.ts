import { deferP0, pipeInto as pp } from "ts-functional-pipe";
import { Indexed } from "../types/Indexed";
import { map } from "./map";
import { orderBy } from "./orderBy";

export function _unwrapIndexed<T>(src: Iterable<Indexed<T>>): Iterable<T> {
  return pp(
    src,
    orderBy(([, idx]) => idx),
    map(([value]) => value)
  );
}

export const unwrapIndexed = deferP0(_unwrapIndexed);
