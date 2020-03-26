import { ThenComparerBuilder } from 'ts-comparer-builder/dist/types/ComparerBuilder'
import { _select, select } from '../select'
import { pp } from 'ts-functional-pipe'

export default class OrderedIterable<T> implements Iterable<T> {
  private src: Iterable<T>
  comparerBuilder: ThenComparerBuilder<T>;
  [Symbol.iterator]: () => IterableIterator<T>
  constructor(src: Iterable<T>, comparerBuilder: ThenComparerBuilder<T>) {
    const comparer = comparerBuilder.build()
    /* istanbul ignore next */
    {
      this[Symbol.iterator] = function*() {
        const arr = pp(
          [..._select(src, (item, idx) => ({ item, idx }))].sort((a, b) => {
            const comp = comparer(a.item, b.item)
            return comp === 0 ? a.idx - b.idx : comp
          }),
          select(({ item }) => item)
        )
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
