import { defaultComparer } from "ts-comparer-builder";
import { deepEqualityComparer } from "ts-equality-comparer";
import { pipeInto } from "ts-functional-pipe";
import { createComparerMap, createComparerSet } from "ts-hashmap";
import { test, describe, expect } from "vitest";
import {
  aggregate,
  all,
  append,
  average,
  concat,
  cartesian,
  count,
  deduplicateBy,
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
  // _reduce,
  toIterable,
  _first,
  // _zipAllToTuple,
  zipMap,
  scan,
  _toMap,
  _toSet,
  _zipAll,
  _unwrapIndexed,
  unwrapIndexed,
} from "..";
import getIdentity from "../transformers/helpers/getIdentity";
import { Date } from "./Date";

const createSetFactory = <K>() => ({
  createSet: () => createComparerSet<K>(deepEqualityComparer),
});
const createMapFactory = <K>() => ({
  createMap: <T>() => createComparerMap<K, T>(deepEqualityComparer),
});

describe("ts-iterable-functions test", () => {
  test("RangeIterable generates range", () => {
    const it = range(0, 3);

    expect([...it]).toEqual([0, 1, 2]);
    expect([...it]).toEqual([0, 1, 2]);
  });
  test("RangeIterable args validation works", () => {
    expect(() => range(0, -1)).toThrow();
    expect(() => range(0.1, 1)).toThrow();
    expect(() => range(0, 1.1)).toThrow();
  });
  test("where works", () => {
    const it = range(0, 3);
    const whereQ = pipeInto(
      it,
      where((x) => x > 0),
    );
    expect([...whereQ]).toEqual([1, 2]);
    expect([...whereQ]).toEqual([1, 2]);
  });
  test("select works", () => {
    const it = range(0, 3);
    const selected = pipeInto(
      it,
      select((x) => x * 2),
    );
    expect([...selected]).toEqual([0, 2, 4]);
    expect([...selected]).toEqual([0, 2, 4]);
  });
  test("distinctBy", () => {
    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
    ];
    expect(
      pipeInto(
        dates,
        distinctBy((d) => d.year),
        count(),
      ),
    ).toBe(2);
  });
  test("distinctBy with comparer", () => {
    const numbers = pipeInto(
      range(0, 1000),
      select((x) => (x / 5) | 0),
    );
    expect(
      pipeInto(
        numbers,
        distinctBy((d) => d, createSetFactory()),
        count(),
      ),
    ).toBe(200);
  });
  test("deduplicateBy", () => {
    const entries = [
      { id: 1, value: "first" },
      { id: 1, value: "second" },
      { id: 2, value: "third" },
      { id: 2, value: "fourth" },
    ];
    const deduped = pipeInto(
      entries,
      deduplicateBy((item) => item.id),
      toArray(),
    );
    expect(deduped).toEqual([entries[0], entries[2]]);
  });
  test("orderBy", () => {
    const values = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 2, b: 2 },
    ];

    const sorted = pipeInto(
      values,
      orderByDescending((x) => x.a),
      thenByDescending((x) => x.b),
    );
    expect([...sorted]).toEqual([
      { a: 2, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 1 },
    ]);

    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
    ];
    const sortedDates = pipeInto(
      dates,
      orderBy((x) => x.year),
      thenBy((x) => x.month),
      thenBy((x) => x.day),
      toArray(),
    );
    expect(sortedDates).toEqual([
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 10, year: 2000 },
    ]);

    const sortedDates2 = pipeInto(
      sortedDates,
      orderByDescending((x) => x.year),
      thenByDescending((x) => x.month),
      thenByDescending((x) => x.day),
      toArray(),
    );
    expect(sortedDates2).toEqual([
      { day: 1, month: 10, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
    ]);
    expect(
      pipeInto(
        [1, 2],
        orderByDescending((x) => x),
        toArray(),
      ),
    ).toEqual([2, 1]);
    expect(
      pipeInto(
        [2, 1],
        orderByDescending((x) => x),
        toArray(),
      ),
    ).toEqual([2, 1]);
    expect(
      pipeInto(
        [0, 0],
        orderByDescending((x) => x),
        toArray(),
      ),
    ).toEqual([0, 0]);

    const items = pipeInto(
      range(0, 100),
      map((x) => ({ a: 1, idx: x })),
      orderBy((x) => x.a),
      map((x) => x.idx),
    );
    expect(pipeInto(items, sequenceEqual(range(0, 100)))).toBeTruthy();

    const stableOrdered = pipeInto(
      [
        { category: 1, label: "b" },
        { category: 1, label: "a" },
      ],
      orderBy((entry) => entry.category),
    );
    expect(stableOrdered.toJSON()).toEqual([...stableOrdered]);
  });

  test("can compose", () => {
    const it = range(0, 3);
    const selected = pipeInto(
      it,
      select((x) => x * 2),
    );
    const selectedFiltered = pipeInto(
      selected,
      where((x) => x > 2),
    );
    expect([...selectedFiltered]).toEqual([4]);
    expect([...selectedFiltered]).toEqual([4]);
  });
  test("selectMany", () => {
    const it = range(0, 2);
    const selected = pipeInto(
      it,
      selectMany((_) => [1, 2]),
    );
    expect([...selected]).toEqual([1, 2, 1, 2]);
  });

  test("repeat", () => {
    const it = repeat(1, 2);
    expect([...it]).toEqual([1, 1]);
  });
  test("repeatGenerate", () => {
    const it = repeatGenerate((i) => i, 3);
    expect([...it]).toEqual([0, 1, 2]);

    const src = repeatGenerate(() => Math.random(), 1000);
    expect(pipeInto(src, sequenceEqual(src))).toBeFalsy();
  });
  test("aggregate", () => {
    const v = pipeInto(
      range(0, 4),
      aggregate(0, (prev, curr) => prev + curr),
    );
    expect(v).toEqual(6);
  });
  test("scan", () => {
    expect(
      pipeInto(
        range(0, 4),
        scan((acc, curr) => acc + curr, 0),
        toArray(),
      ),
    ).toEqual([0, 1, 3, 6]);
    expect(
      pipeInto(
        range(0, 4),
        scan((acc, curr) => acc + curr),
        toArray(),
      ),
    ).toEqual([1, 3, 6]);
    expect(
      pipeInto(
        range(1, 4),
        scan((acc, curr) => acc + curr),
        toArray(),
      ),
    ).toEqual([3, 6, 10]);
    expect(
      pipeInto(
        range(0, 4),
        scan((acc, curr) => acc + curr, 1),
        toArray(),
      ),
    ).toEqual([1, 2, 4, 7]);
    expect(
      pipeInto(
        [] as number[],
        scan((acc, curr) => acc + curr, 1),
        toArray(),
      ),
    ).toEqual([]);
    expect(() =>
      pipeInto(
        [] as number[],
        scan((acc, curr) => acc + curr),
        toArray(),
      ),
    ).toThrow();
    expect(
      pipeInto(
        [1] as number[],
        scan((acc, curr) => acc + curr, 1),
        toArray(),
      ),
    ).toEqual([2]);
    expect(
      pipeInto(
        [7, 1, 2, 3],
        scan(
          (acc, curr, idx) => (idx < 3 ? Math.min(acc, curr) : curr),
          100000,
        ),
        toArray(),
      ),
    ).toEqual([7, 1, 1, 3]);
  });
  test("reduce", () => {
    const v = pipeInto(
      range(0, 4),
      reduce((prev, curr) => prev + curr, 0),
    );
    expect(v).toEqual(6);
    const v2 = pipeInto(
      range(0, 4),
      reduce((prev, curr) => prev + curr),
    );
    expect(v2).toEqual(6);
    const v3 = pipeInto(
      range(0, 4),
      map((v) => v.toString()),
      reduce((prev, curr) => `${prev}${curr}`),
    );
    expect(v3).toEqual("0123");
  });
  test("reduceRight", () => {
    const v = pipeInto(
      [
        [0, 1],
        [2, 3],
        [4, 5],
      ],
      reduceRight((prev, curr) => prev.concat(curr), new Array<number>()),
    );
    expect(v).toEqual([4, 5, 2, 3, 0, 1]);
    const v2 = pipeInto(
      range(0, 4),
      reduceRight((prev, curr) => prev + curr),
    );
    expect(v2).toEqual(6);
    const v3 = pipeInto(
      range(0, 4),
      map((v) => v.toString()),
      reduceRight((prev, curr) => `${prev}${curr}`),
    );
    expect(v3).toEqual("3210");
  });
  test("all", () => {
    const fourZeroes = repeat(0, 4);
    const val = pipeInto(
      fourZeroes,
      all((v) => v === 1),
    );
    expect(val).toEqual(false);
    const val2 = pipeInto(
      fourZeroes,
      all((v) => v === 0),
    );
    expect(val2).toEqual(true);
    const val3 = pipeInto(
      fourZeroes,
      all((v) => v === 1),
    );
    expect(val3).toEqual(false);
  });
  test("some", () => {
    const fourZeroes = repeat(0, 4);

    expect(
      pipeInto(
        fourZeroes,
        some((x) => x === 1),
      ),
    ).toBe(false);
    expect(
      pipeInto(
        fourZeroes,
        some((x) => x === 0),
      ),
    ).toBe(true);
    expect(pipeInto(fourZeroes, some())).toBe(true);
    expect(pipeInto([], some())).toBe(false);
  });
  test("concat", () => {
    expect([...pipeInto([1, 2, 3], concat([4, 5], [6, 7]))]).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });
  test("average", () => {
    expect(pipeInto([1, 2, 3, 4], average())).toBe(2.5);
    expect(() => pipeInto([], average())).toThrow();
  });
  test("count", () => {
    expect(pipeInto([1, 2, 3, 4], count())).toBe(4);
    expect(pipeInto([], count())).toBe(0);
    expect(
      pipeInto(
        [1, 2, 3, 4],
        count((x) => x > 2),
      ),
    ).toBe(2);
  });
  test("single", () => {
    expect(pipeInto([1], single())).toBe(1);
    expect(() => pipeInto([], single())).toThrow();
    expect(() => pipeInto([1, 2], single())).toThrow();
    expect(() =>
      pipeInto(
        [1, 2],
        single((x) => x > 2),
      ),
    ).toThrow();
    expect(
      pipeInto(
        [1, 2],
        single((x) => x > 1),
      ),
    ).toBe(2);
    expect(pipeInto([false], single())).toEqual(false);
  });
  test("singleOrDefault", () => {
    expect(pipeInto([1], singleOrDefault())).toBe(1);
    expect(pipeInto([], singleOrDefault())).toBeUndefined();
    expect(() => pipeInto([1, 2], singleOrDefault())).toThrow();
    expect(
      pipeInto(
        [1, 2],
        singleOrDefault((x) => x > 2),
      ),
    ).toBeUndefined();
    expect(
      pipeInto(
        [1, 2],
        singleOrDefault((x) => x > 1),
      ),
    ).toBe(2);
    expect(pipeInto([false], singleOrDefault())).toEqual(false);
  });
  test("elementAt", () => {
    expect(pipeInto([1, 2, 3], elementAt(1))).toBe(2);
    expect(() => pipeInto([1, 2, 3], elementAt(3))).toThrow();
  });

  test("except", () => {
    expect([...pipeInto([1, 2, 3], except([1, 3]))]).toEqual([2]);
  });
  test("first", () => {
    expect(pipeInto(range(0, 3), first())).toBe(0);
    expect(
      pipeInto(
        range(0, 3),
        first((x) => x > 0),
      ),
    ).toBe(1);
    expect(() =>
      pipeInto(
        range(0, 3),
        first((x) => x > 2),
      ),
    ).toThrow();
    expect(pipeInto([false], first())).toEqual(false);
  });
  test("firstOrDefault", () => {
    expect(pipeInto(range(0, 3), firstOrDefault())).toBe(0);
    expect(
      pipeInto(
        range(0, 3),
        firstOrDefault((x) => x > 0),
      ),
    ).toBe(1);
    expect(
      pipeInto(
        range(0, 3),
        firstOrDefault((x) => x > 2),
      ),
    ).toBeUndefined();
    expect(pipeInto([false], firstOrDefault())).toEqual(false);
  });
  test("last", () => {
    expect(pipeInto(range(0, 3), last())).toBe(2);
    expect(
      pipeInto(
        range(0, 3),
        last((x) => x < 2),
      ),
    ).toBe(1);
    expect(() =>
      pipeInto(
        range(0, 3),
        last((x) => x > 2),
      ),
    ).toThrow();
    expect(() => pipeInto([false], last())).not.toThrow();
  });
  test("lastOrDefault", () => {
    expect(pipeInto(range(0, 3), lastOrDefault())).toBe(2);
    expect(
      pipeInto(
        range(0, 3),
        lastOrDefault((x) => x < 2),
      ),
    ).toBe(1);
    expect(
      pipeInto(
        range(0, 3),
        lastOrDefault((x) => x > 2),
      ),
    ).toBeUndefined();
    expect(() => pipeInto([false], lastOrDefault())).not.toThrow();
  });
  test("forEach", () => {
    pipeInto(
      range(0, 3),
      forEach((x, i) => expect(x).toBe(i)),
    );
  });
  test("intersect", () => {
    expect([...pipeInto(range(0, 5), intersect(range(3, 10)))]).toEqual([3, 4]);
  });
  test("intersect with comparer", () => {
    expect([
      ...pipeInto(range(0, 5), intersect(range(3, 10), createSetFactory())),
    ]).toEqual([3, 4]);
  });

  test("isSubsetOf", () => {
    expect(pipeInto(range(0, 2), isSubsetOf([0, 1, 2, 3]))).toEqual(true);
    expect(pipeInto(range(-2, 2), isSubsetOf([0, 1, 2, 3]))).toEqual(false);
  });
  test("isSupersetOf", () => {
    expect(pipeInto(range(0, 5), isSupersetOf([0, 1]))).toEqual(true);
    expect(pipeInto(range(0, 5), isSupersetOf([6, 7]))).toEqual(false);
  });
  test("max", () => {
    expect(() => pipeInto([], max())).toThrow();
    expect(pipeInto([1], max())).toBe(1);
    expect(pipeInto([5, 4, 3, 2, 1], max())).toBe(5);
    expect(
      pipeInto(
        [5, 4, 3, 2, 1],
        select((x) => [...repeat(x, 2)]),
        max(([x, _]) => x),
      ),
    ).toBe(5);
    expect(
      pipeInto(
        [5, 4, 3, 2, 1],
        max(
          (x) => x,
          (a, b) => -defaultComparer(a, b),
        ),
      ),
    ).toBe(1);
  });
  test("min", () => {
    expect(() => pipeInto([], min())).toThrow();
    expect(pipeInto([1], min())).toBe(1);
    expect(pipeInto([5, 4, 3, 2, 1], min())).toBe(1);
    expect(
      pipeInto(
        [5, 4, 3, 2, 1],
        select((x) => [...repeat(x, 2)]),
        min(([x, _]) => x),
      ),
    ).toBe(1);

    expect(
      pipeInto(
        [5, 4, 3, 2, 1],
        min(
          (x) => x,
          (a, b) => -defaultComparer(a, b),
        ),
      ),
    ).toBe(5);
  });
  test("defaultComparer", () => {
    expect(defaultComparer(0, 1)).toBe(-1);
    expect(defaultComparer(1, 0)).toBe(1);
    expect(defaultComparer(0, 0)).toBe(0);
  });
  const identity = getIdentity();
  test("identity", () => {
    const src = repeatGenerate(() => Math.random(), 1000);
    pipeInto(
      src,
      forEach((x) => {
        expect(identity(x)).toBe(x);
      }),
    );
    pipeInto(
      src,
      forEach((x) => {
        const str = x.toString();
        expect(/^-?\d+(\.\d+)?$/.test(str)).toBeTruthy();
        expect(identity(str)).toBe(str);
      }),
    );
  });
  test("reverse", () => {
    expect([...pipeInto([5, 4, 3, 2, 1], reverse())]).toEqual([1, 2, 3, 4, 5]);
  });
  test("sequenceEqual", () => {
    expect(pipeInto(range(0, 3), sequenceEqual([0, 1, 2]))).toBeTruthy();
    expect(pipeInto(range(0, 3), sequenceEqual([0, 1, 4]))).toBeFalsy();
    expect(pipeInto(range(0, 3), sequenceEqual([0, 1]))).toBeFalsy();
    expect(pipeInto(range(0, 2), sequenceEqual([0, 1, 2]))).toBeFalsy();
  });
  test("sequenceEqual with comparer", () => {
    expect(
      pipeInto(
        range(0, 3),
        sequenceEqual([0, 1, 2], deepEqualityComparer.equals),
      ),
    ).toBeTruthy();
    expect(
      pipeInto(
        range(0, 3),
        sequenceEqual([0, 1, 4], deepEqualityComparer.equals),
      ),
    ).toBeFalsy();
    expect(
      pipeInto(range(0, 3), sequenceEqual([0, 1], deepEqualityComparer.equals)),
    ).toBeFalsy();
    expect(
      pipeInto(
        range(0, 2),
        sequenceEqual([0, 1, 2], deepEqualityComparer.equals),
      ),
    ).toBeFalsy();
  });
  test("toArray", () => {
    expect(pipeInto(range(0, 2), toArray())).toEqual([0, 1]);
  });
  test("toLookup", () => {
    const lookup = pipeInto(
      range(0, 10),
      toLookup((x) => x % 2),
    );
    expect(pipeInto(lookup, count())).toBe(2);
    expect([...(lookup.get(0) ?? [])]).toEqual([0, 2, 4, 6, 8]);
    expect([...(lookup.get(1) ?? [])]).toEqual([1, 3, 5, 7, 9]);
  });
  test("toLookup with comparer", () => {
    const lookup = pipeInto(
      range(0, 10),
      toLookup((x) => x % 2, createMapFactory()),
    );
    expect(pipeInto(lookup, count())).toBe(2);
    expect([...(lookup.get(0) ?? [])]).toEqual([0, 2, 4, 6, 8]);
    expect([...(lookup.get(1) ?? [])]).toEqual([1, 3, 5, 7, 9]);
    const lookup2 = pipeInto(
      range(0, 10),
      toLookup(
        (x) => x % 2,
        (x) => x * 2,
        createMapFactory(),
      ),
    );
    expect(pipeInto(lookup2, count())).toBe(2);
    expect([...(lookup2.get(0) ?? [])]).toEqual([0, 4, 8, 12, 16]);
    expect([...(lookup2.get(1) ?? [])]).toEqual([2, 6, 10, 14, 18]);
  });
  test("toMap", () => {
    const map = pipeInto(
      range(0, 10),
      toMap(
        (x) => x,
        (x) => x / 2,
      ),
    );
    expect(pipeInto(map, count())).toBe(10);
    pipeInto(
      map,
      forEach(([k, v]) => {
        expect(v).toBe(k / 2);
      }),
    );
    expect(map.get(10)).toBeUndefined();
    expect(() =>
      pipeInto(
        [0, 0],
        toMap(
          (x) => x,
          (x) => x,
        ),
      ),
    ).toThrow();
    expect(() =>
      pipeInto(
        range(0, 10),
        toMap((x) => (x / 2) | 0, createMapFactory()),
      ),
    ).toThrow();
  });
  test("_toMap overloads", () => {
    const source = [
      { id: 1, name: "alpha" },
      { id: 2, name: "beta" },
    ];
    const fromFactory = _toMap(source, (item) => item.id, createMapFactory());
    expect(fromFactory.get(1)?.name).toBe("alpha");

    const withSelectorAndFactory = _toMap(
      source,
      (item) => item.id,
      (item) => item.name,
      createMapFactory(),
    );
    expect([...withSelectorAndFactory.values()]).toEqual(["alpha", "beta"]);
  });
  test("toSet", () => {
    const set = pipeInto(
      range(0, 10),
      toSet((x) => x),
    );
    expect(pipeInto(set, count())).toBe(10);

    expect(set.has(10)).toBeFalsy();
    expect(() =>
      pipeInto(
        [1, 1],
        toSet((x) => x),
      ),
    ).toThrow();

    const set2 = pipeInto(range(0, 10), toSet());
    expect(pipeInto(set2, count())).toBe(10);

    expect(set2.has(10)).toBeFalsy();
    const set3 = pipeInto(range(0, 10), toSet(createSetFactory()));
    expect(pipeInto(set3, count())).toBe(10);

    expect(set3.has(10)).toBeFalsy();
    expect(() =>
      pipeInto(
        range(0, 10),
        toSet((x) => (x / 2) | 0, createSetFactory()),
      ),
    ).toThrow();
  });
  test("_toSet with factory", () => {
    const set = _toSet([1, 2, 3], createSetFactory());
    expect([...set]).toEqual([1, 2, 3]);
  });
  test("groupBy", () => {
    const output = pipeInto(
      range(0, 2),
      groupBy((x) => x % 2),
      selectMany((x) =>
        pipeInto(
          x,
          select((xx) => [x.key, xx]),
        ),
      ),
    );
    expect([...output]).toEqual([
      [0, 0],
      [1, 1],
    ]);
    expect([...output]).toEqual([
      [0, 0],
      [1, 1],
    ]);

    const grouped = [
      ...pipeInto(
        range(0, 4),
        groupBy((x) => x % 2),
      ),
    ];
    expect(grouped[0].toJSON()).toEqual([...grouped[0]]);
  });
  test("groupJoin", () => {
    const seq1 = range(0, 5);
    const seq2 = pipeInto(
      range(3, 5),
      selectMany((x) => repeat(x, 2)),
    );
    const joined = pipeInto(
      seq1,
      groupJoin(
        seq2,
        (x) => x,
        (x) => x,
        (k, v) => ({ k, v }),
      ),
    );
    expect([
      ...pipeInto(
        joined,
        select((x) => x.k),
      ),
    ]).toEqual([0, 1, 2, 3, 4]);
    expect([
      ...pipeInto(
        joined,
        select((x) => x.k),
      ),
    ]).toEqual([0, 1, 2, 3, 4]);
    expect([
      ...pipeInto(
        joined,
        select((x) => [...x.v]),
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]]);
    expect([
      ...pipeInto(
        joined,
        select((x) => [...x.v]),
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]]);
  });
  test("groupJoin with comparer", () => {
    const seq1 = range(0, 5);
    const seq2 = pipeInto(
      range(3, 5),
      selectMany((x) => repeat(x, 2)),
    );
    const joined = pipeInto(
      seq1,
      groupJoin(
        seq2,
        (x) => x,
        (x) => x,
        (k, v) => ({ k, v }),
        createMapFactory(),
      ),
    );
    expect([
      ...pipeInto(
        joined,
        select((x) => x.k),
      ),
    ]).toEqual([0, 1, 2, 3, 4]);
    expect([
      ...pipeInto(
        joined,
        select((x) => x.k),
      ),
    ]).toEqual([0, 1, 2, 3, 4]);
    expect([
      ...pipeInto(
        joined,
        select((x) => [...x.v]),
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]]);
    expect([
      ...pipeInto(
        joined,
        select((x) => [...x.v]),
      ),
    ]).toEqual([[], [], [], [3, 3], [4, 4]]);
  });
  test("fullOuterGroupJoin", () => {
    const seq1 = pipeInto(
      range(0, 5),
      selectMany((x) => repeat(x, 2)),
    );
    const seq2 = pipeInto(
      range(1, 5),
      selectMany((x) => repeat(x, 2)),
    );
    const gj = pipeInto(
      seq1,
      fullOuterGroupJoin(
        seq2,
        (x) => x,
        (x) => x,

        (lft, rgt, i) => ({ lft: lft && [...lft], rgt: rgt && [...rgt], i }),
      ),
    );
    const lookup = pipeInto(
      gj,
      toMap(
        (x) => x.i,
        (x) => x,
      ),
    );
    const key0 = lookup.get(0);
    expect(
      key0 &&
        key0.rgt.length === 0 &&
        key0.lft &&
        pipeInto(key0.lft, sequenceEqual([0, 0])),
    ).toBeTruthy();
    const key5 = lookup.get(5);
    expect(
      key5 &&
        key5.lft.length === 0 &&
        key5.rgt &&
        pipeInto(key5.rgt, sequenceEqual([5, 5])),
    ).toBeTruthy();

    const mid = pipeInto(gj, skip(1), reverse(), skip(1), reverse());

    pipeInto(
      mid,
      forEach((x) => {
        expect(x.lft).toEqual(x.rgt);
        expect([...repeat(x.i, 2)]).toEqual(x.lft);
      }),
    );
  });
  test("fullOuterJoin", () => {
    const seq1 = range(0, 5);
    const seq2 = range(1, 5);
    const j = pipeInto(
      seq1,
      fullOuterJoin(
        seq2,
        (x) => x,
        (x) => x,
        (l, r) => ({ l, r }),
      ),
    );
    const r1 = pipeInto(
      j,
      single((x) => x.l === 0),
    );
    expect(typeof r1.r === "undefined" && r1.l === 0).toBeTruthy();
    const r2 = pipeInto(
      j,
      single((x) => x.l === 1),
    );
    expect(r2.r === 1 && r2.l === 1).toBeTruthy();
  });

  test("join", () => {
    const outerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "chris",
      },
      {
        id: 2,
        value: "andrew",
      },
      {
        id: 4,
        value: "not relevant",
      },
    ];
    const innerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "sperry",
      },
      {
        id: 1,
        value: "pike",
      },
      {
        id: 2,
        value: "johnson",
      },
      {
        id: 3,
        value: "not relevant",
      },
    ];

    const items = pipeInto(
      outerSeq,
      join(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) => outerItem.value + " " + innerItem.value,
      ),
    );

    expect([...items]).toEqual([
      "chris sperry",
      "chris pike",
      "andrew johnson",
    ]);
    // expect([...items]).toEqual(["chris sperry", "chris pike", "andrew johnson"]);
  });

  test("leftOuterJoin", () => {
    const outerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "chris",
      },
      {
        id: 2,
        value: "andrew",
      },
      {
        id: 4,
        value: "not relevant",
      },
    ];
    const innerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "sperry",
      },
      {
        id: 1,
        value: "pike",
      },
      {
        id: 2,
        value: "johnson",
      },
      {
        id: 3,
        value: "not relevant",
      },
    ];

    const items = pipeInto(
      outerSeq,
      leftOuterJoin(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) =>
          outerItem.value + " " + (innerItem ? innerItem.value : "no match"),
      ),
    );

    expect([...items]).toEqual([
      "chris sperry",
      "chris pike",
      "andrew johnson",
      "not relevant no match",
    ]);
  });
  test("leftOuterJoin with comparer", () => {
    const outerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "chris",
      },
      {
        id: 2,
        value: "andrew",
      },
      {
        id: 4,
        value: "not relevant",
      },
    ];
    const innerSeq: { id: number; value: string }[] = [
      {
        id: 1,
        value: "sperry",
      },
      {
        id: 1,
        value: "pike",
      },
      {
        id: 2,
        value: "johnson",
      },
      {
        id: 3,
        value: "not relevant",
      },
    ];

    const items = pipeInto(
      outerSeq,
      leftOuterJoin(
        innerSeq,
        (outerItem) => outerItem.id,
        (innerItem) => innerItem.id,
        (outerItem, innerItem) =>
          outerItem.value + " " + (innerItem ? innerItem.value : "no match"),
        createMapFactory(),
      ),
    );

    expect([...items]).toEqual([
      "chris sperry",
      "chris pike",
      "andrew johnson",
      "not relevant no match",
    ]);
  });

  test("skip", () => {
    expect([...pipeInto([1, 2, 3], skip(1))]).toEqual([2, 3]);
  });
  test("take", () => {
    expect([...pipeInto([1, 2, 3], take(2))]).toEqual([1, 2]);
  });
  test("sum", () => {
    expect(pipeInto([1, 2, 3], sum())).toEqual(6);
  });
  test("union", () => {
    const u = pipeInto(range(0, 10), union(range(5, 10)));
    expect([...u]).toEqual([...range(0, 15)]);
  });
  test("zip", () => {
    expect(
      pipeInto(
        [1, 2],
        zip([2, 1], (a, b) => [a, b]),
        toArray(),
      ),
    ).toEqual([
      [1, 2],
      [2, 1],
    ]);
    expect(
      pipeInto(
        [1, 2],
        zip([2, 1, 5], (a, b) => [a, b]),
        toArray(),
      ),
    ).toEqual([
      [1, 2],
      [2, 1],
    ]);
    expect(
      pipeInto(
        [1, 2, 5],
        zip([2, 1], (a, b) => [a, b]),
        toArray(),
      ),
    ).toEqual([
      [1, 2],
      [2, 1],
    ]);
  });
  test("maxBy, minBy", () => {
    interface Person {
      name: string;
      age: number;
    }
    const arr: Person[] = [
      { name: "chris", age: 44 },
      { name: "nicole", age: 48 },
      { name: "pav", age: 45 },
      { name: "luke", age: 41 },
    ];
    expect(
      pipeInto(
        arr,
        maxBy((x) => x.age),
        first(),
      ).name,
    ).toBe("nicole");
    expect(
      pipeInto(
        arr,
        minBy((x) => x.age),
        first(),
      ).name,
    ).toBe("luke");
    expect(
      pipeInto(
        arr,
        take(0),
        minBy((x) => x.age),
        toArray(),
      ),
    ).toEqual([]);
    expect(
      pipeInto(
        [0, 0],
        minBy((x) => x),
        toArray(),
      ),
    ).toEqual([0, 0]);
    expect(
      pipeInto(
        [0, 0],
        maxBy((x) => x),
        toArray(),
      ),
    ).toEqual([0, 0]);
    const inverseComparer = <T>(a: T, b: T) => defaultComparer(b, a);
    expect(
      pipeInto(
        arr,
        maxBy((x) => x.age, inverseComparer),
        first(),
      ).name,
    ).toBe("luke");
    expect(
      pipeInto(
        arr,
        minBy((x) => x.age, inverseComparer),
        first(),
      ).name,
    ).toBe("nicole");
  });
  test("append", () => {
    expect(pipeInto([1, 2], append(3), toArray())).toEqual([1, 2, 3]);
  });
  test("prepend", () => {
    expect(pipeInto([1, 2], prepend(3), toArray())).toEqual([3, 1, 2]);
  });
  test("flatten", () => {
    expect(
      pipeInto(
        [1, 2],
        select((x) => repeat(x, 2)),
        flatten(),
        toArray(),
      ),
    ).toEqual([1, 1, 2, 2]);
  });
  test("zipAll", () => {
    const b = [
      [1, 2],
      [1, 2, 3],
    ];

    expect(
      pipeInto(
        b,
        zipAll(),
        select((x) => [...x]),
        toArray(),
      ),
    ).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });
  test("_zipAll empty source", () => {
    expect([..._zipAll([])]).toEqual([]);
  });
  test("unwrapIndexed restores original order", () => {
    const source: [string, number][] = [
      ["beta", 1],
      ["alpha", 0],
      ["gamma", 2],
    ];
    expect([..._unwrapIndexed(source)]).toEqual(["alpha", "beta", "gamma"]);
    expect([...pipeInto(source, unwrapIndexed())]).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
  });
  test("groupAdjacent", () => {
    expect(
      pipeInto(
        [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2],
        groupAdjacent(
          (x) => x,
          (x) => x,
          (_, items) => [...items],
        ),
        toArray(),
      ),
    ).toEqual([
      [1, 1],
      [2, 2, 2],
      [3, 3, 3, 3],
      [2, 2],
    ]);
  });
  test("groupAdjacent with comparer", () => {
    expect(
      pipeInto(
        [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2],
        groupAdjacent(
          (x) => x,
          (x) => x,
          (_, items) => [...items],
          deepEqualityComparer.equals,
        ),
        toArray(),
      ),
    ).toEqual([
      [1, 1],
      [2, 2, 2],
      [3, 3, 3, 3],
      [2, 2],
    ]);
  });
  test("skipWhile", () => {
    expect(
      pipeInto(
        [1, 2, 3, 4, 1, 5],
        skipWhile((x) => x < 3),
        toArray(),
      ),
    ).toEqual([3, 4, 1, 5]);
  });
  test("orderBy impure selector", () => {
    const _range = range(0, 1000);
    const randomOrder = pipeInto(
      _range,
      orderBy((_) => Math.random()),
    );
    expect(pipeInto(randomOrder, sequenceEqual(_range))).toBeFalsy();
    expect(pipeInto(randomOrder, sequenceEqual(randomOrder))).toBeFalsy();
    const reordered = pipeInto(
      randomOrder,
      orderBy((x) => x),
    );
    expect(pipeInto(reordered, sequenceEqual(_range))).toBeTruthy();
  });
  test("cartesian", () => {
    const data: Iterable<Iterable<string>> = [
      ["red", "blue"],
      ["candy", "car"],
    ];
    const result: Iterable<Iterable<string>> = [
      ["red", "candy"],
      ["red", "car"],
      ["blue", "candy"],
      ["blue", "car"],
    ];
    const cart = pipeInto(data, cartesian);
    expect(pipeInto(cart, isSubsetOf(result, createSetFactory()))).toBeTruthy();
    expect(
      pipeInto(cart, isSupersetOf(result, createSetFactory())),
    ).toBeTruthy();
  });
  test("iterable toJSON", () => {
    expect(JSON.stringify(_select([1, 2, 3], identity))).toBe(
      JSON.stringify([1, 2, 3]),
    );
  });
  test("headTail", () => {
    const h = headTail(range(0, 10));
    const [head, tail] = h;
    expect(head).toBe(0);
    expect(_sequenceEqual(tail, range(1, 9))).toBe(true);
    const x: number[] = [];
    expect(() => headTail(x)).toThrow();
    const iterable = getImpureIterable();
    const [h1, t1] = headTail(iterable);
    expect(h1).toBe(0);
    expect([...t1]).toEqual([1, 2]);
  });
  test("impure iterable", () => {
    const iterable = getImpureIterable();
    expect([...iterable]).toEqual([0, 1, 2]);
    expect([...iterable]).toEqual([1, 2, 3]);
    expect(_first(iterable)).toBe(2);
    expect(_first(iterable)).toBe(3);
  });
  test("zipAllToTuple", () => {
    const len = 50;
    const list1 = range(0, len + 100);
    const list2 = pipeInto(
      range(0, len - 1),
      map((x) => `number ${x}`),
    );
    const zipped = pipeInto([list1, list2] as const, zipAllToTuple());

    expect([...zipped]).toEqual(
      pipeInto(
        range(0, len - 1),
        map((i) => [i, `number ${i}`] as const),
        toArray(),
      ),
    );
  });
  test("zipMap", () => {
    const seq1 = [1, 2, 3];
    const seq2 = ["a", "b", "c", "d"];
    const seq3 = [9, 8, 7];
    const sequences: [Iterable<number>, Iterable<string>, Iterable<number>] = [
      seq1,
      seq2,
      seq3,
    ];
    const zipMapped = pipeInto(
      sequences,
      zipMap((num1, str, num2) => `${num1}${str}${num2}`),
    );
    expect([...zipMapped]).toEqual(["1a9", "2b8", "3c7"]);
  });
});
function getImpureIterable() {
  let a = 0;
  const iterable = toIterable(function* () {
    const start = a++;
    for (let i = 0; i < 3; i++) {
      yield start + i;
    }
  });
  return iterable;
}
