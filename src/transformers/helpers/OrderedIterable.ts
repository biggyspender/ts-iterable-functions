import { ThenComparerBuilder } from 'ts-comparer-builder/dist/types/ComparerBuilder'

export default class OrderedIterable<T> implements Iterable<T> {
  private src: Iterable<T>
  comparerBuilder: ThenComparerBuilder<T>;
  [Symbol.iterator]: () => IterableIterator<T>
  constructor(src: Iterable<T>, comparerBuilder: ThenComparerBuilder<T>) {
    const comparer = comparerBuilder.build()
    /* istanbul ignore next */
    {
      this[Symbol.iterator] = function*() {
        const arr = [...src].sort(comparer)
        for (const x of arr) {
          yield x
        }
      }
    }
    this.src = src
    this.comparerBuilder = comparerBuilder
  }
  createNewFrom(b: (builder: ThenComparerBuilder<T>) => ThenComparerBuilder<T>) {
    return new OrderedIterable<T>(this.src, b(this.comparerBuilder))
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
