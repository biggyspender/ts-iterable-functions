---

## 🔄 Comparison with Alternatives

| Library                | Type Safety | Pipeable | LINQ-like | Dependencies | ESM/CJS | Bundle Size |
|------------------------|:-----------:|:--------:|:---------:|:------------:|:-------:|:-----------:|
| ts-iterable-functions  |     ✅      |   ✅     |    ✅     |      0       |  ✅/✅   |   Tiny      |
| lodash/underscore      |     ❌      |   ❌     |    ❌     |     Many     |  ✅/✅   |   Large     |
| rxjs                   |     ✅      |   ✅     |    ❌     |     Many     |  ✅/✅   |   Large     |
| native JS iterables    |     ❌      |   ❌     |    ❌     |      0       |  ✅/✅   |   Small     |

---

## 🌍 Real-World Use Cases

- Data transformation pipelines in backend and frontend apps
- Analytics and reporting tools
- ETL (Extract, Transform, Load) processes
- Building custom collection utilities
- Replacing verbose array logic with readable, type-safe pipelines

<p align="center">
  <img src="https://placehold.co/600x120?text=ts-iterable-functions" alt="ts-iterable-functions logo"/>
</p>

# ts-iterable-functions


[![npm](https://img.shields.io/npm/v/ts-iterable-functions.svg?style=flat)](https://npmjs.org/package/ts-iterable-functions "View this project on npm")
[![build](https://github.com/biggyspender/ts-iterable-functions/actions/workflows/ts-iterable-functions.yml/badge.svg?branch=master)](https://github.com/biggyspender/ts-iterable-functions/actions/workflows/ts-iterable-functions.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/ts-iterable-functions)](https://bundlephobia.com/package/ts-iterable-functions)

<p align="center"><b>Type-safe, LINQ-inspired iterable utilities for TypeScript & JavaScript – designed for composability and modern functional pipelines.</b></p>

---

## 🚀 Features

- Familiar LINQ-like API for iterable sequences
- Type-safe and fully typed throughout
- Pipeable unary function versions for functional composition
- Zero dependencies, ESM & CJS support
- Works great with <a href="https://www.npmjs.com/package/ts-functional-pipe">ts-functional-pipe</a>
- Fast builds with esbuild


---


## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [API Overview](#-api-overview)
- [Functions for iterable sequences](#functions-for-iterable-sequences)
- [Usage with pipes](#usage-with-pipes)
- [Generators](#generators)
- [Transformers](#transformers)
- [Acknowledgements](#acknowledgements)

---

## 🧩 API Overview

| Function         | Description                                      |
|------------------|--------------------------------------------------|
| `map`/`select`   | Transform each element in an iterable            |
| `filter`/`where` | Filter elements by predicate                     |
| `reduce`         | Reduce iterable to a single value                |
| `groupBy`        | Group elements by key selector                   |
| `orderBy`        | Sort elements by key selector                    |
| `thenBy`         | Secondary sort for already ordered iterables     |
| `toArray`        | Convert iterable to array                        |
| `toSet`          | Convert iterable to set                          |
| `concat`         | Concatenate multiple iterables                   |
| `distinct`       | Remove duplicate elements                        |
| `flatten`        | Flatten nested iterables                         |
| `sum`/`average`  | Aggregate numeric values                         |
| `zip`            | Combine multiple iterables element-wise           |
| ...and more!     | See below for the full list                      |

---
Install:

```sh
npm install ts-iterable-functions ts-functional-pipe ts-equality-comparer ts-comparer-builder
```

Use in your code:

```typescript
import { pipeInto as pp } from "ts-functional-pipe";
import { map, orderBy, thenBy, toArray } from "ts-iterable-functions";

const cars = [
  { manufacturer: "Ford", model: "Escort" },
  { manufacturer: "Ford", model: "Cortina" },
  { manufacturer: "Renault", model: "Clio" },
  { manufacturer: "Vauxhall", model: "Corsa" },
  { manufacturer: "Ford", model: "Fiesta" },
  { manufacturer: "Fiat", model: "500" },
];

const orderedCars = pp(
  cars,
  orderBy((c) => c.manufacturer),
  thenBy((c) => c.model),
  toArray()
);

console.log(orderedCars);
// [
//   { manufacturer: 'Fiat', model: '500' },
//   { manufacturer: 'Ford', model: 'Cortina' },
//   { manufacturer: 'Ford', model: 'Escort' },
//   { manufacturer: 'Ford', model: 'Fiesta' },
//   { manufacturer: 'Renault', model: 'Clio' },
//   { manufacturer: 'Vauxhall', model: 'Corsa' }
// ]
```

---

### Note

Versions > 5.x are now built with [esbuild](https://esbuild.github.io/) and no longer support IE11.

## Functions for iterable sequences

Almost every function in this collection is designed to work over `Iterable<T>`.

### An example

Let's start with `map` (which is also aliased to `select`) to see how it works.

Here's an `Iterable<number>`

```typescript
const src = [1, 2, 3];
```

We can use the `_map` function to transform this as follows:

```typescript
const times2 = _map(src, (x) => x + x);
```

### Two forms of the same function

All of the functions that transform iterables in this library exist in two forms.

The first form is the one we used above and looks like this:

```typescript
function _someOperator<T, A, B, R>(src: T, a: A, b: B): R;
```

and by convention is prefixed with an `_underscore`. While handy in their own way, composing these functions is ugly.

```typescript
//this looks awful
const times2squared = _map(
  _map(src, (x) => x + x),
  (x) => x * x
);
```

### The pipeable function

If, instead, we had functions that look like this

```typescript
function someOperator<T, A, B, R>(a: A, b: B): (src: T) => R;
```

where the function returns a **_unary_** function of the form `(src: T) => R`, we can use them in pipes (where the output of one function is fed in to the input of the next function).

In fact, we can transform `_someOperator` into `someOperator` (preserving all type information) with the [`deferP0`](https://github.com/biggyspender/ts-functional-pipe/blob/master/src/deferP0.ts) function (from [ts-functional-pipe](https://github.com/biggyspender/ts-functional-pipe)):

```typescript
const deferP0 =
  <P0, A extends any[], R>(fn: (src: P0, ...args: A) => R) =>
  (...args: A) =>
  (src: P0): R =>
    fn(src, ...args);
```

so, we could take the `_map` function above and transform it into the pipeable form with a simple call to `deferP0(_map)`.

All functions that transform `Iterable<T>` in the library exist in the two forms. So, for instance the map function exists as `_map` and `map`. Moving forward, we'll be avoiding the `_underscored` functions.

## Usage with pipes

The functions in this library are designed to be composed. Package [`ts-functional-pipe`](https://github.com/biggyspender/ts-functional-pipe) offers excellent type-inference for this purpose. There is good information about to use the `pipe`/`pipeInto`/`compose` functions it contains in the [`README`](https://github.com/biggyspender/ts-functional-pipe/blob/master/README.md) over there.

### Making `times2squared` readable

Let's use `pipeInto` (imported above as `pp`) to pipe our iterable into a chain of unary functions, generated (in this case) using the `map` function discussed above:

```typescript
const src = [1, 2, 3];
const times2squared = pp(
  src,
  map((x) => x + x),
  map((x) => x * x)
);
```

## Types in the pipe are preserved

Due to some funky type-definitions in [ts-functional-pipe](https://github.com/biggyspender/ts-functional-pipe), types flow through the pipe nicely:

```typescript
const src = [1, 2, 3];
const toStringRepeated = pp(
  src,
  map((x) => x.toString()), // here x is number
  map((s) => s + s) // here s is string
); // returns a string
```

and all types are correctly inferred.

More coming soon.

## Generators

`range`, `repeat`, `repeatGenerate`

## Transformers

`aggregate`, `all`/`every`, `append`, `average`, `concat`, `count`, `defaultIfEmpty`, `distinctBy`, `distinct`, `elementAt`, `except`, `firstOrDefault`, `first`, `flatten`, `forEach`, `fullOuterGroupJoin`, `fullOuterJoin`, `groupAdjacent`, `groupBy`, `groupJoin`, `intersect`, `isSubsetOf`, `isSupersetOf`, `join`, `lastOrDefault`, `last`, `leftOuterJoin`, `maxBy`, `max`, `minBy`, `min`, `orderByDescending`, `orderBy`, `preprend`, `reduce`, `reduceRight`, `reverse`, `selectMany`/`flapMap`, `select`/`map`, `sequenceEqual`, `singleOrDefault`, `single`, `skip`, `skipWhile`, `some`, `sum`, `take`, `takeWhile`, `thenByDescending`, `thenBy`, `toArray`, `toLookup`, `toMap`, `toSet`, `union`, `where`/`filter`, `zipAll`, `zip`, `zipMap`


---

## 🤝 Contributing & Community

Contributions, bug reports, and feature requests are welcome! Please open an [issue](https://github.com/biggyspender/ts-iterable-functions/issues) or start a [discussion](https://github.com/biggyspender/ts-iterable-functions/discussions) on GitHub.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

### Acknowledgements

Created using the wonderful [typescript-library-starter](https://github.com/gjuchault/typescript-library-starter).
