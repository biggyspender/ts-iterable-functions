import getIdentity from '../src/transformers/helpers/getIdentity'
import { pipeInto as pp } from 'ts-functional-pipe'
import {
  aggregate,
  all,
  append,
  average,
  concat,
  cartesian,
  count,
  distinctBy,
  elementAt,
  except,
  first,
  firstOrDefault,
  flatten,
  forEach,
  fullOuterGroupJoin,
  fullOuterJoin,
  groupAdjacent,
  groupBy,
  groupJoin,
  intersect,
  isSubsetOf,
  isSupersetOf,
  join,
  last,
  lastOrDefault,
  leftOuterJoin,
  max,
  maxBy,
  min,
  minBy,
  orderBy,
  orderByDescending,
  prepend,
  range,
  reduce,
  repeat,
  repeatGenerate,
  reverse,
  select,
  selectMany,
  sequenceEqual,
  single,
  singleOrDefault,
  skip,
  some,
  sum,
  take,
  thenBy,
  thenByDescending,
  toArray,
  toLookup,
  toMap,
  toSet,
  union,
  where,
  zip,
  zipAll,
  zipAllToTuple,
  reduceRight,
  map,
  skipWhile,
  _select,
  headTail,
  _sequenceEqual,
  _reduce,
  toIterable,
  _first,
  _zipAllToTuple,
  zipMap,
} from '../src/ts-iterable-functions'
import { Date } from './Date'
import { deepEqualityComparer } from 'ts-equality-comparer'
import { createComparerMap, createComparerSet } from 'ts-hashmap'
import { defaultComparer } from 'ts-comparer-builder'

const createSetFactory = <K>() => ({ createSet: () => createComparerSet<K>(deepEqualityComparer) })
const createMapFactory = <K>() => ({
  createMap: <T>() => createComparerMap<K, T>(deepEqualityComparer),
})

describe('ts-iterable-functions test', () => {
  test('RangeIterable generates range', () => {
    const it = range(0, 3)

    expect([...it]).toEqual([0, 1, 2])
    expect([...it]).toEqual([0, 1, 2])
  })
  test('RangeIterable args validation works', () => {
    expect(() => range(0, -1)).toThrow()
    expect(() => range(0.1, 1)).toThrow()
    expect(() => range(0, 1.1)).toThrow()
  })
  test('where works', () => {
    const it = range(0, 3)
    const whereQ = pp(
      it,
      where((x) => x > 0)
    )
    expect([...whereQ]).toEqual([1, 2])
    expect([...whereQ]).toEqual([1, 2])
  })
  test('select works', () => {
    const it = range(0, 3)
    const selected = pp(
      it,
      select((x) => x * 2)
    )
    expect([...selected]).toEqual([0, 2, 4])
    expect([...selected]).toEqual([0, 2, 4])
  })
  test('distinctBy', () => {
    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
    ]
    expect(
      pp(
        dates,
        distinctBy((d) => d.year),
        count()
      )
    ).toBe(2)
  })
  test('distinctBy with comparer', () => {
    const nums = pp(
      range(0, 1000),
      select((x) => (x / 5) | 0)
    )
    expect(
      pp(
        nums,
        distinctBy((d) => d, createSetFactory()),
        count()
      )
    ).toBe(200)
  })
  test('orderBy', () => {
    const values = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 2, b: 2 },
    ]

    const sorted = pp(
      values,
      orderByDescending((x) => x.a),
      thenByDescending((x) => x.b)
    )
    expect([...sorted]).toEqual([
      { a: 2, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 1 },
    ])

    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
    ]
    const sortedDates = pp(
      dates,
      orderBy((x) => x.year),
      thenBy((x) => x.month),
      thenBy((x) => x.day),
      toArray()
    )
    expect(sortedDates).toEqual([
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 10, year: 2000 },
    ])

    const sortedDates2 = pp(
      sortedDates,
      orderByDescending((x) => x.year),
      thenByDescending((x) => x.month),
      thenByDescending((x) => x.day),
      toArray()
    )
    expect(sortedDates2).toEqual([
      { day: 1, month: 10, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
    ])
    expect(
      pp(
        [1, 2],
        orderByDescending((x) => x),
        toArray()
      )
    ).toEqual([2, 1])
    expect(
      pp(
        [2, 1],
        orderByDescending((x) => x),
        toArray()
      )
    ).toEqual([2, 1])
    expect(
      pp(
        [0, 0],
        orderByDescending((x) => x),
        toArray()
      )
    ).toEqual([0, 0])

    const items = pp(
      range(0, 100),
      map((x) => ({ a: 1, idx: x })),
      orderBy((x) => x.a),
      map((x) => x.idx)
    )
    expect(pp(items, sequenceEqual(range(0, 100)))).toBeTruthy()
  })

  test('can compose', () => {
    const it = range(0, 3)
    const selected = pp(
      it,
      select((x) => x * 2)
    )
    const selectedFiltered = pp(
      selected,
      where((x) => x > 2)
    )
    expect([...selectedFiltered]).toEqual([4])
    expect([...selectedFiltered]).toEqual([4])
  })
  test('selectMany', () => {
    const it = range(0, 2)
    const selected = pp(
      it,
      selectMany((_) => [1, 2])
    )
    expect([...selected]).toEqual([1, 2, 1, 2])
  })

  test('repeat', () => {
    const it = repeat(1, 2)
    expect([...it]).toEqual([1, 1])
  })
  test('repeatGenerate', () => {
    const it = repeatGenerate((i) => i, 3)
    expect([...it]).toEqual([0, 1, 2])

    const src = repeatGenerate(() => Math.random(), 1000)
    expect(pp(src, sequenceEqual(src))).toBeFalsy()
  })
  test('aggregate', () => {
    const v = pp(
      range(0, 4),
      aggregate(0, (prev, curr) => prev + curr)
    )
    expect(v).toEqual(6)
  })
  test('reduce', () => {
    const v = pp(
      range(0, 4),
      reduce((prev, curr) => prev + curr, 0)
    )
    expect(v).toEqual(6)
    const v2 = pp(
      range(0, 4),
      reduce((prev, curr) => prev + curr)
    )
    expect(v2).toEqual(6)
    const v3 = pp(
      range(0, 4),
      map((v) => v.toString()),
      reduce((prev, curr) => `${prev}${curr}`)
    )
    expect(v3).toEqual('0123')
  })
  test('reduceRight', () => {
    const v = pp(
      [
        [0, 1],
        [2, 3],
        [4, 5],
      ],
      reduceRight((prev, curr) => prev.concat(curr), new Array<number>())
    )
    expect(v).toEqual([4, 5, 2, 3, 0, 1])
    const v2 = pp(
      range(0, 4),
      reduceRight((prev, curr) => prev + curr)
    )
    expect(v2).toEqual(6)
    const v3 = pp(
      range(0, 4),
      map((v) => v.toString()),
      reduceRight((prev, curr) => `${prev}${curr}`)
    )
    expect(v3).toEqual('3210')
  })
  test('all', () => {
    const fourZeroes = repeat(0, 4)
    const val = pp(
      fourZeroes,
      all((v) => v === 1)
    )
    expect(val).toEqual(false)
    const val2 = pp(
      fourZeroes,
      all((v) => v === 0)
    )
    expect(val2).toEqual(true)
    const val3 = pp(
      fourZeroes,
      all((v) => v === 1)
    )
    expect(val3).toEqual(false)
  })
  test('some', () => {
    const fourZeroes = repeat(0, 4)

    expect(
      pp(
        fourZeroes,
        some((x) => x === 1)
      )
    ).toBe(false)
    expect(
      pp(
        fourZeroes,
        some((x) => x === 0)
      )
    ).toBe(true)
    expect(pp(fourZeroes, some())).toBe(true)
    expect(pp([], some())).toBe(false)
  })
  test('concat', () => {
    expect([...pp([1, 2, 3], concat([4, 5], [6, 7]))]).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  test('average', () => {
    expect(pp([1, 2, 3, 4], average())).toBe(2.5)
    expect(() => pp([], average())).toThrow()
  })
  test('count', () => {
    expect(pp([1, 2, 3, 4], count())).toBe(4)
    expect(pp([], count())).toBe(0)
    expect(
      pp(
        [1, 2, 3, 4],
        count((x) => x > 2)
      )
    ).toBe(2)
  })
  test('single', () => {
    expect(pp([1], single())).toBe(1)
    expect(() => pp([], single())).toThrow()
    expect(() => pp([1, 2], single())).toThrow()
    expect(() =>
      pp(
        [1, 2],
        single((x) => x > 2)
      )
    ).toThrow()
    expect(
      pp(
        [1, 2],
        single((x) => x > 1)
      )
    ).toBe(2)
    expect(pp([false], single())).toEqual(false)
  })
  test('singleOrDefault', () => {
    expect(pp([1], singleOrDefault())).toBe(1)
    expect(pp([], singleOrDefault())).toBeUndefined()
    expect(() => pp([1, 2], singleOrDefault())).toThrow()
    expect(
      pp(
        [1, 2],
        singleOrDefault((x) => x > 2)
      )
    ).toBeUndefined()
    expect(
      pp(
        [1, 2],
        singleOrDefault((x) => x > 1)
      )
    ).toBe(2)
    expect(pp([false], singleOrDefault())).toEqual(false)
  })
  test('elementAt', () => {
    expect(pp([1, 2, 3], elementAt(1))).toBe(2)
    expect(() => pp([1, 2, 3], elementAt(3))).toThrow()
  })

  test('except', () => {
    expect([...pp([1, 2, 3], except([1, 3]))]).toEqual([2])
  })
  test('first', () => {
    expect(pp(range(0, 3), first())).toBe(0)
    expect(
      pp(
        range(0, 3),
        first((x) => x > 0)
      )
    ).toBe(1)
    expect(() =>
      pp(
        range(0, 3),
        first((x) => x > 2)
      )
    ).toThrow()
    expect(pp([false], first())).toEqual(false)
  })
  test('firstOrDefault', () => {
    expect(pp(range(0, 3), firstOrDefault())).toBe(0)
    expect(
      pp(
        range(0, 3),
        firstOrDefault((x) => x > 0)
      )
    ).toBe(1)
    expect(
      pp(
        range(0, 3),
        firstOrDefault((x) => x > 2)
      )
    ).toBeUndefined()
    expect(pp([false], firstOrDefault())).toEqual(false)
  })
  test('last', () => {
    expect(pp(range(0, 3), last())).toBe(2)
    expect(
      pp(
        range(0, 3),
        last((x) => x < 2)
      )
    ).toBe(1)
    expect(() =>
      pp(
        range(0, 3),
        last((x) => x > 2)
      )
    ).toThrow()
    expect(() => pp([false], last())).not.toThrow()
  })
  test('lastOrDefault', () => {
    expect(pp(range(0, 3), lastOrDefault())).toBe(2)
    expect(
      pp(
        range(0, 3),
        lastOrDefault((x) => x < 2)
      )
    ).toBe(1)
    expect(
      pp(
        range(0, 3),
        lastOrDefault((x) => x > 2)
      )
    ).toBeUndefined()
    expect(() => pp([false], lastOrDefault())).not.toThrow()
  })
  test('forEach', () => {
    pp(
      range(0, 3),
      forEach((x, i) => expect(x).toBe(i))
    )
  })
  test('intersect', () => {
    expect([...pp(range(0, 5), intersect(range(3, 10)))]).toEqual([3, 4])
  })
  test('intersect with comparer', () => {
    expect([...pp(range(0, 5), intersect(range(3, 10), createSetFactory()))]).toEqual([3, 4])
  })

  test('isSubsetOf', () => {
    expect(pp(range(0, 2), isSubsetOf([0, 1, 2, 3]))).toEqual(true)
    expect(pp(range(-2, 2), isSubsetOf([0, 1, 2, 3]))).toEqual(false)
  })
  test('isSupersetOf', () => {
    expect(pp(range(0, 5), isSupersetOf([0, 1]))).toEqual(true)
    expect(pp(range(0, 5), isSupersetOf([6, 7]))).toEqual(false)
  })
  test('max', () => {
    expect(() => pp([], max())).toThrow()
    expect(pp([1], max())).toBe(1)
    expect(pp([5, 4, 3, 2, 1], max())).toBe(5)
    expect(
      pp(
        [5, 4, 3, 2, 1],
        select((x) => [...repeat(x, 2)]),
        max(([x, _]) => x)
      )
    ).toBe(5)
    expect(
      pp(
        [5, 4, 3, 2, 1],
        max(
          (x) => x,
          (a, b) => -defaultComparer(a, b)
        )
      )
    ).toBe(1)
  })
  test('min', () => {
    expect(() => pp([], min())).toThrow()
    expect(pp([1], min())).toBe(1)
    expect(pp([5, 4, 3, 2, 1], min())).toBe(1)
    expect(
      pp(
        [5, 4, 3, 2, 1],
        select((x) => [...repeat(x, 2)]),
        min(([x, _]) => x)
      )
    ).toBe(1)

    expect(
      pp(
        [5, 4, 3, 2, 1],
        min(
          (x) => x,
          (a, b) => -defaultComparer(a, b)
        )
      )
    ).toBe(5)
  })
  test('defaultComparer', () => {
    expect(defaultComparer(0, 1)).toBe(-1)
    expect(defaultComparer(1, 0)).toBe(1)
    expect(defaultComparer(0, 0)).toBe(0)
  })
  const identity = getIdentity()
  test('identity', () => {
    const src = repeatGenerate(() => Math.random(), 1000)
    pp(
      src,
      forEach((x) => {
        expect(identity(x)).toBe(x)
      })
    )
    pp(
      src,
      forEach((x) => {
        const str = x.toString()
        expect(/^-?\d+(\.\d+)?$/.test(str)).toBeTruthy()
        expect(identity(str)).toBe(str)
      })
    )
  })
  test('reverse', () => {
    expect([...pp([5, 4, 3, 2, 1], reverse())]).toEqual([1, 2, 3, 4, 5])
  })
  test('sequenceEqual', () => {
    expect(pp(range(0, 3), sequenceEqual([0, 1, 2]))).toBeTruthy()
    expect(pp(range(0, 3), sequenceEqual([0, 1, 4]))).toBeFalsy()
    expect(pp(range(0, 3), sequenceEqual([0, 1]))).toBeFalsy()
    expect(pp(range(0, 2), sequenceEqual([0, 1, 2]))).toBeFalsy()
  })
  test('sequenceEqual with comparer', () => {
    expect(pp(range(0, 3), sequenceEqual([0, 1, 2], deepEqualityComparer.equals))).toBeTruthy()
    expect(pp(range(0, 3), sequenceEqual([0, 1, 4], deepEqualityComparer.equals))).toBeFalsy()
    expect(pp(range(0, 3), sequenceEqual([0, 1], deepEqualityComparer.equals))).toBeFalsy()
    expect(pp(range(0, 2), sequenceEqual([0, 1, 2], deepEqualityComparer.equals))).toBeFalsy()
  })
  test('toArray', () => {
    expect(pp(range(0, 2), toArray())).toEqual([0, 1])
  })
  test('toLookup', () => {
    const lookup = pp(
      range(0, 10),
      toLookup((x) => x % 2)
    )
    expect(pp(lookup, count())).toBe(2)
    expect([...(lookup.get(0) ?? [])]).toEqual([0, 2, 4, 6, 8])
    expect([...(lookup.get(1) ?? [])]).toEqual([1, 3, 5, 7, 9])
  })
  test('toLookup with comparer', () => {
    const lookup = pp(
      range(0, 10),
      toLookup((x) => x % 2, createMapFactory())
    )
    expect(pp(lookup, count())).toBe(2)
    expect([...(lookup.get(0) ?? [])]).toEqual([0, 2, 4, 6, 8])
    expect([...(lookup.get(1) ?? [])]).toEqual([1, 3, 5, 7, 9])
    const lookup2 = pp(
      range(0, 10),
      toLookup(
        (x) => x % 2,
        (x) => x * 2,
        createMapFactory()
      )
    )
    expect(pp(lookup2, count())).toBe(2)
    expect([...(lookup2.get(0) ?? [])]).toEqual([0, 4, 8, 12, 16])
    expect([...(lookup2.get(1) ?? [])]).toEqual([2, 6, 10, 14, 18])
  })
  test('toMap', () => {
    const map = pp(
      range(0, 10),
      toMap(
        (x) => x,
        (x) => x / 2
      )
    )
    expect(pp(map, count())).toBe(10)
    pp(
      map,
      forEach(([k, v]) => {
        expect(v).toBe(k / 2)
      })
    )
    expect(map.get(10)).toBeUndefined()
    expect(() =>
      pp(
        [0, 0],
        toMap(
          (x) => x,
          (x) => x
        )
      )
    ).toThrow()
    expect(() =>
      pp(
        range(0, 10),
        toMap((x) => (x / 2) | 0, createMapFactory())
      )
    ).toThrow()
  })
  test('toSet', () => {
    const set = pp(
      range(0, 10),
      toSet((x) => x)
    )
    expect(pp(set, count())).toBe(10)

    expect(set.has(10)).toBeFalsy()
    expect(() =>
      pp(
        [1, 1],
        toSet((x) => x)
      )
    ).toThrow()

    const set2 = pp(range(0, 10), toSet())
    expect(pp(set2, count())).toBe(10)

    expect(set2.has(10)).toBeFalsy()
    const set3 = pp(range(0, 10), toSet(createSetFactory()))
    expect(pp(set3, count())).toBe(10)

    expect(set3.has(10)).toBeFalsy()
    expect(() =>
      pp(
        range(0, 10),
        toSet((x) => (x / 2) | 0, createSetFactory())
      )
    ).toThrow()
  })
  test('groupBy', () => {
    const output = pp(
      range(0, 2),
      groupBy((x) => x % 2),
      selectMany((x) =>
        pp(
          x,
          select((xx) => [x.key, xx])
        )
      )
    )
    expect([...output]).toEqual([
      [0, 0],
      [1, 1],
    ])
    expect([...output]).toEqual([
      [0, 0],
      [1, 1],
    ])
  })
  test('groupJoin', () => {
    const seq1 = range(0, 5)
    const seq2 = pp(
      range(3, 5),
      selectMany((x) => repeat(x, 2))
    )
    const joined = pp(
      seq1,
      groupJoin(
        seq2,
        (x) => x,
        (x) => x,
        (k, v) => ({ k, v })
      )
    )
    expect([
      ...pp(
        joined,
        select((x) => x.k)
      ),
    ]).toEqual([0, 1, 2, 3, 4])
    expect([
      ...pp(
        joined,
        select((x) => x.k)
      ),
    ]).toEqual([0, 1, 2, 3, 4])
    expect([
      ...pp(
        joined,
        select((x) => [...x.v])
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]])
    expect([
      ...pp(
        joined,
        select((x) => [...x.v])
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]])
  })
  test('groupJoin with comparer', () => {
    const seq1 = range(0, 5)
    const seq2 = pp(
      range(3, 5),
      selectMany((x) => repeat(x, 2))
    )
    const joined = pp(
      seq1,
      groupJoin(
        seq2,
        (x) => x,
        (x) => x,
        (k, v) => ({ k, v }),
        createMapFactory()
      )
    )
    expect([
      ...pp(
        joined,
        select((x) => x.k)
      ),
    ]).toEqual([0, 1, 2, 3, 4])
    expect([
      ...pp(
        joined,
        select((x) => x.k)
      ),
    ]).toEqual([0, 1, 2, 3, 4])
    expect([
      ...pp(
        joined,
        select((x) => [...x.v])
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]])
    expect([
      ...pp(
        joined,
        select((x) => [...x.v])
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]])
  })
  test('fullOuterGroupJoin', () => {
    const seq1 = pp(
      range(0, 5),
      selectMany((x) => repeat(x, 2))
    )
    const seq2 = pp(
      range(1, 5),
      selectMany((x) => repeat(x, 2))
    )
    const gj = pp(
      seq1,
      fullOuterGroupJoin(
        seq2,
        (x) => x,
        (x) => x,
        (lft, rgt, i) => ({ lft: lft && [...lft], rgt: rgt && [...rgt], i })
      )
    )
    const lookup = pp(
      gj,
      toMap(
        (x) => x.i,
        (x) => x
      )
    )
    const key0 = lookup.get(0)
    expect(
      key0 && key0.rgt.length === 0 && key0.lft && pp(key0.lft, sequenceEqual([0, 0]))
    ).toBeTruthy()
    const key5 = lookup.get(5)
    expect(
      key5 && key5.lft.length === 0 && key5.rgt && pp(key5.rgt, sequenceEqual([5, 5]))
    ).toBeTruthy()

    const mid = pp(gj, skip(1), reverse(), skip(1), reverse())

    pp(
      mid,
      forEach((x) => {
        expect(x.lft).toEqual(x.rgt)
        expect([...repeat(x.i, 2)]).toEqual(x.lft)
      })
    )
  })
  test('fullOuterJoin', () => {
    const seq1 = range(0, 5)
    const seq2 = range(1, 5)
    const j = pp(
      seq1,
      fullOuterJoin(
        seq2,
        (x) => x,
        (x) => x,
        (l, r) => ({ l, r })
      )
    )
    const r1 = pp(
      j,
      single((x) => x.l === 0)
    )
    expect(typeof r1.r === 'undefined' && r1.l === 0).toBeTruthy()
    const r2 = pp(
      j,
      single((x) => x.l === 1)
    )
    expect(r2.r === 1 && r2.l === 1).toBeTruthy()
  })

  test('join', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris',
      },
      {
        id: 2,
        value: 'andrew',
      },
      {
        id: 4,
        value: 'not relevant',
      },
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry',
      },
      {
        id: 1,
        value: 'pike',
      },
      {
        id: 2,
        value: 'johnson',
      },
      {
        id: 3,
        value: 'not relevant',
      },
    ]

    let items = pp(
      outerSeq,
      join(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) => outerItem.value + ' ' + innerItem.value
      )
    )

    expect([...items]).toEqual(['chris sperry', 'chris pike', 'andrew johnson'])
    // expect([...items]).toEqual(["chris sperry", "chris pike", "andrew johnson"]);
  })

  test('leftOuterJoin', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris',
      },
      {
        id: 2,
        value: 'andrew',
      },
      {
        id: 4,
        value: 'not relevant',
      },
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry',
      },
      {
        id: 1,
        value: 'pike',
      },
      {
        id: 2,
        value: 'johnson',
      },
      {
        id: 3,
        value: 'not relevant',
      },
    ]

    let items = pp(
      outerSeq,
      leftOuterJoin(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) => outerItem.value + ' ' + (innerItem ? innerItem.value : 'no match')
      )
    )

    expect([...items]).toEqual([
      'chris sperry',
      'chris pike',
      'andrew johnson',
      'not relevant no match',
    ])
  })
  test('leftOuterJoin with comparer', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris',
      },
      {
        id: 2,
        value: 'andrew',
      },
      {
        id: 4,
        value: 'not relevant',
      },
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry',
      },
      {
        id: 1,
        value: 'pike',
      },
      {
        id: 2,
        value: 'johnson',
      },
      {
        id: 3,
        value: 'not relevant',
      },
    ]

    let items = pp(
      outerSeq,
      leftOuterJoin(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) =>
          outerItem.value + ' ' + (innerItem ? innerItem.value : 'no match'),
        createMapFactory()
      )
    )

    expect([...items]).toEqual([
      'chris sperry',
      'chris pike',
      'andrew johnson',
      'not relevant no match',
    ])
  })

  test('skip', () => {
    expect([...pp([1, 2, 3], skip(1))]).toEqual([2, 3])
  })
  test('take', () => {
    expect([...pp([1, 2, 3], take(2))]).toEqual([1, 2])
  })
  test('sum', () => {
    expect(pp([1, 2, 3], sum())).toEqual(6)
  })
  test('union', () => {
    const u = pp(range(0, 10), union(range(5, 10)))
    expect([...u]).toEqual([...range(0, 15)])
  })
  test('zip', () => {
    expect(
      pp(
        [1, 2],
        zip([2, 1], (a, b) => [a, b]),
        toArray()
      )
    ).toEqual([
      [1, 2],
      [2, 1],
    ])
    expect(
      pp(
        [1, 2],
        zip([2, 1, 5], (a, b) => [a, b]),
        toArray()
      )
    ).toEqual([
      [1, 2],
      [2, 1],
    ])
    expect(
      pp(
        [1, 2, 5],
        zip([2, 1], (a, b) => [a, b]),
        toArray()
      )
    ).toEqual([
      [1, 2],
      [2, 1],
    ])
  })
  test('maxBy, minBy', () => {
    interface Person {
      name: string
      age: number
    }
    const arr: Person[] = [
      { name: 'chris', age: 44 },
      { name: 'nicole', age: 48 },
      { name: 'pav', age: 45 },
      { name: 'luke', age: 41 },
    ]
    expect(
      pp(
        arr,
        maxBy((x) => x.age),
        first()
      ).name
    ).toBe('nicole')
    expect(
      pp(
        arr,
        minBy((x) => x.age),
        first()
      ).name
    ).toBe('luke')
    expect(() =>
      pp(
        arr,
        take(0),
        minBy((x) => x.age)
      )
    ).toThrow()
    expect(
      pp(
        [0, 0],
        minBy((x) => x),
        toArray()
      )
    ).toEqual([0, 0])
    expect(
      pp(
        [0, 0],
        maxBy((x) => x),
        toArray()
      )
    ).toEqual([0, 0])
    const inverseComparer = <T>(a: T, b: T) => defaultComparer(b, a)
    expect(
      pp(
        arr,
        maxBy((x) => x.age, inverseComparer),
        first()
      ).name
    ).toBe('luke')
    expect(
      pp(
        arr,
        minBy((x) => x.age, inverseComparer),
        first()
      ).name
    ).toBe('nicole')
  })
  test('append', () => {
    expect(pp([1, 2], append(3), toArray())).toEqual([1, 2, 3])
  })
  test('prepend', () => {
    expect(pp([1, 2], prepend(3), toArray())).toEqual([3, 1, 2])
  })
  test('flatten', () => {
    expect(
      pp(
        [1, 2],
        select((x) => repeat(x, 2)),
        flatten(),
        toArray()
      )
    ).toEqual([1, 1, 2, 2])
  })
  test('zipAll', () => {
    const b = [
      [1, 2],
      [1, 2, 3],
    ]

    expect(
      pp(
        b,
        zipAll(),
        select((x) => [...x]),
        toArray()
      )
    ).toEqual([
      [1, 1],
      [2, 2],
    ])
  })
  test('groupAdjacent', () => {
    expect(
      pp(
        [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2],
        groupAdjacent(
          (x) => x,
          (x) => x,
          (key, items) => [...items]
        ),
        toArray()
      )
    ).toEqual([
      [1, 1],
      [2, 2, 2],
      [3, 3, 3, 3],
      [2, 2],
    ])
  })
  test('groupAdjacent with comparer', () => {
    expect(
      pp(
        [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2],
        groupAdjacent(
          (x) => x,
          (x) => x,
          (key, items) => [...items],
          deepEqualityComparer.equals
        ),
        toArray()
      )
    ).toEqual([
      [1, 1],
      [2, 2, 2],
      [3, 3, 3, 3],
      [2, 2],
    ])
  })
  test('skipWhile', () => {
    expect(
      pp(
        [1, 2, 3, 4, 1, 5],
        skipWhile((x) => x < 3),
        toArray()
      )
    ).toEqual([3, 4, 1, 5])
  })
  test('orderBy impure selector', () => {
    const _range = range(0, 1000)
    const randomOrder = pp(
      _range,
      orderBy((_) => Math.random())
    )
    expect(pp(randomOrder, sequenceEqual(_range))).toBeFalsy()
    expect(pp(randomOrder, sequenceEqual(randomOrder))).toBeFalsy()
    const reordered = pp(
      randomOrder,
      orderBy((x) => x)
    )
    expect(pp(reordered, sequenceEqual(_range))).toBeTruthy()
  })
  test('cartesian', () => {
    const data: Iterable<Iterable<string>> = [
      ['red', 'blue'],
      ['candy', 'car'],
    ]
    const result: Iterable<Iterable<string>> = [
      ['red', 'candy'],
      ['red', 'car'],
      ['blue', 'candy'],
      ['blue', 'car'],
    ]
    const cart = pp(data, cartesian)
    expect(pp(cart, isSubsetOf(result, createSetFactory()))).toBeTruthy()
    expect(pp(cart, isSupersetOf(result, createSetFactory()))).toBeTruthy()
  })
  test('iterable toJSON', () => {
    expect(JSON.stringify(_select([1, 2, 3], identity))).toBe(JSON.stringify([1, 2, 3]))
  })
  test('headTail', () => {
    const h = headTail(range(0, 10))
    const [head, tail] = h
    expect(head).toBe(0)
    expect(_sequenceEqual(tail, range(1, 9))).toBe(true)
    const x: number[] = []
    expect(() => headTail(x)).toThrow()
    const iterable = getImpureIterable()
    const [h1, t1] = headTail(iterable)
    expect(h1).toBe(0)
    expect([...t1]).toEqual([1, 2])
  })
  test('impure iterable', () => {
    const iterable = getImpureIterable()
    expect([...iterable]).toEqual([0, 1, 2])
    expect([...iterable]).toEqual([1, 2, 3])
    expect(_first(iterable)).toBe(2)
    expect(_first(iterable)).toBe(3)
  })
  test('zipAllToTuple', () => {
    const len = 50
    const list1 = range(0, len + 100)
    const list2 = pp(
      range(0, len - 1),
      map((x) => `number ${x}`)
    )
    const zipped = pp([list1, list2] as const, zipAllToTuple())

    expect([...zipped]).toEqual(
      pp(
        range(0, len - 1),
        map((i) => [i, `number ${i}`] as const),
        toArray()
      )
    )
  })
  test('zipMap', () => {
    const seq1 = [1, 2, 3]
    const seq2 = ['a', 'b', 'c', 'd']
    const seq3 = [9, 8, 7]
    const seqs: [Iterable<number>, Iterable<string>, Iterable<number>] = [seq1, seq2, seq3]
    const zipMapped = pp(
      seqs,
      zipMap((num1, str, num2) => `${num1}${str}${num2}`)
    )
    expect([...zipMapped]).toEqual(['1a9', '2b8', '3c7'])
  })
})
function getImpureIterable() {
  let a = 0
  const iterable = toIterable(function* () {
    const start = a++
    for (let i = 0; i < 3; i++) {
      yield start + i
    }
  })
  return iterable
}
