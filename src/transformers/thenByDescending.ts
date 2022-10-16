import { deferP0 } from "ts-functional-pipe";
import OrderedIterable from "./helpers/OrderedIterable";
export function _thenByDescending<T, TCmp>(
  src: OrderedIterable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  return src.createNewFrom((builder) => builder.thenKeyDescending(selector));
}
export const thenByDescending = deferP0(_thenByDescending);
