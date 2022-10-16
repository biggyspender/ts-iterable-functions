import { ThenComparerBuilder } from "ts-comparer-builder/dist/types/ComparerBuilder";
import { pipeInto as pp } from "ts-functional-pipe";
import { _indexed } from "../indexed";
import { map } from "../map";

export default class OrderedIterable<T> implements Iterable<T> {
  private src: Iterable<T>;
  comparerBuilder: ThenComparerBuilder<T>;
  [Symbol.iterator]: () => IterableIterator<T>;
  constructor(src: Iterable<T>, comparerBuilder: ThenComparerBuilder<T>) {
    const comparer = comparerBuilder.build();
    /* istanbul ignore next */
    {
      this[Symbol.iterator] = function* () {
        const arr = pp(
          [..._indexed(src)].sort(([aVal, aIdx], [bVal, bIdx]) => {
            const comp = comparer(aVal, bVal);
            return comp === 0 ? aIdx - bIdx : comp;
          }),
          map(([value]) => value)
        );
        for (const x of arr) {
          yield x;
        }
      };
    }
    this.src = src;
    this.comparerBuilder = comparerBuilder;
  }
  toJSON(): T[] {
    return [...this[Symbol.iterator]()];
  }
  createNewFrom(
    b: (builder: ThenComparerBuilder<T>) => ThenComparerBuilder<T>
  ) {
    return new OrderedIterable<T>(this.src, b(this.comparerBuilder));
  }
  // public thenBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
  //   const newBuilder = this.comparerBuilder.thenKey(selector)
  //   return new OrderedIterable(this.src, newBuilder)
  // }
  // public thenByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
  //   const newBuilder = this.comparerBuilder.thenKeyDescending(selector)
  //   return new OrderedIterable(this.src, newBuilder)
  // }
}
