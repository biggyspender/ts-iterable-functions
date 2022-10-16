# ts-iterable-functions

A collection of type-safe functions for operating over iterable sequences, with specialized versions that generate unary functions for use in pipes. Will feel immediately familiar for users of MS LINQ-to-objects.

[![npm version](https://img.shields.io/npm/v/ts-iterable-functions.svg?style=flat)](https://npmjs.org/package/ts-iterable-functions "View this project on npm")
[![build status](https://github.com/biggyspender/ts-iterable-functions/actions/workflows/ts-iterable-functions.yml/badge.svg)](https://github.com/biggyspender/ts-iterable-functions/actions/workflows/ts-iterable-functions.yml)

## Usage

First, import `pipeInto` from [`ts-functional-pipe`](https://www.npmjs.com/package/ts-functional-pipe):

```typescript
import { pipeInto as pp } from "ts-functional-pipe";
```

Let's make a collection of cars

```typescript
const cars = [
  {
    manufacturer: "Ford",
    model: "Escort",
  },
  {
    manufacturer: "Ford",
    model: "Cortina",
  },
  {
    manufacturer: "Renault",
    model: "Clio",
  },
  {
    manufacturer: "Vauxhall",
    model: "Corsa",
  },
  {
    manufacturer: "Ford",
    model: "Fiesta",
  },
  {
    manufacturer: "Fiat",
    model: "500",
  },
];
```

...and sort them by manufacturer, and then by model:

```typescript
const orderedCars = pp(
  cars,
  orderBy((c) => c.manufacturer),
  thenBy((c) => c.model),
  toArray()
);
```

Or we could count the number of cars for each manufacturer:

```typescript
const carsPerManufacturer = pp(
  cars,
  groupBy((c) => c.manufacturer),
  map((g) => ({
    count: _count(g),
    manufacturer: g.key,
  })),
  orderByDescending((c) => c.count),
  thenBy((c) => c.manufacturer)
);
for (var c of carsPerManufacturer) {
  console.log(`${c.manufacturer} : ${c.count}`);
}
```

to give

```
Ford : 3
Fiat : 1
Renault : 1
Vauxhall : 1
```

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

### acknowledgements

Created using the wonderful [https://github.com/gjuchault/typescript-library-starter](https://github.com/gjuchault/typescript-library-starter).

---

# Typescript Library Starter

![NPM](https://img.shields.io/npm/l/@gjuchault/typescript-library-starter)
![NPM](https://img.shields.io/npm/v/@gjuchault/typescript-library-starter)
![GitHub Workflow Status](https://github.com/gjuchault/typescript-library-starter/actions/workflows/typescript-library-starter.yml/badge.svg?branch=main)

Yet another (opinionated) typescript library starter template.

## Opinions and limitations

1. Relies as much as possible on each included library's defaults
2. Only rely on GitHub Actions
3. Do not include documentation generation

## Getting started

1. `npx degit gjuchault/typescript-library-starter my-project` or click on `Use this template` button on GitHub!
2. `cd my-project`
3. `npm install`
4. `git init` (if you used degit)
5. `npm run setup`

To enable deployment, you will need to:

1. Setup `NPM_TOKEN` secret in GitHub actions ([Settings > Secrets > Actions](https://github.com/gjuchault/typescript-service-starter/settings/secrets/actions))
2. Give `GITHUB_TOKEN` write permissions for GitHub releases ([Settings > Actions > General](https://github.com/gjuchault/typescript-service-starter/settings/actions) > Workflow permissions)

## Features

### Node.js, npm version

Typescript Library Starter relies on [volta](https://volta.sh/) to ensure node version to be consistent across developers. It's also used in the GitHub workflow file.

### Typescript

Leverages [esbuild](https://github.com/evanw/esbuild) for blazing fast builds, but keeps `tsc` to generate `.d.ts` files.
Generates two builds to support both ESM and CJS.

Commands:

- `build`: runs typechecking then generates CJS, ESM and `d.ts` files in the `build/` directory
- `clean`: removes the `build/` directory
- `type:dts`: only generates `d.ts`
- `type:check`: only run typechecking
- `type:build`: only generates CJS and ESM

### Tests

typescript-library-starter uses [vitest](https://vitest.dev/). The coverage is done through vitest, using [c8](https://github.com/bcoe/c8).

Commands:

- `test`: runs vitest test runner
- `test:watch`: runs vitest test runner in watch mode
- `test:coverage`: runs vitest test runner and generates coverage reports

### Format & lint

This template relies on the combination of [eslint](https://github.com/eslint/eslint) — through [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for linting and [prettier](https://github.com/prettier/prettier) for formatting.
It also uses [cspell](https://github.com/streetsidesoftware/cspell) to ensure spelling

Commands:

- `format`: runs prettier with automatic fixing
- `format:check`: runs prettier without automatic fixing (used in CI)
- `lint`: runs eslint with automatic fixing
- `lint:check`: runs eslint without automatic fixing (used in CI)
- `spell:check`: runs spellchecking

### Releasing

Under the hood, this library uses [semantic-release](https://github.com/semantic-release/semantic-release) and [commitizen](https://github.com/commitizen/cz-cli).
The goal is to avoid manual release process. Using `semantic-release` will automatically create a github release (hence tags) as well as an npm release.
Based on your commit history, `semantic-release` will automatically create a patch, feature or breaking release.

Commands:

- `cz`: interactive CLI that helps you generate a proper git commit message, using [commitizen](https://github.com/commitizen/cz-cli)
- `semantic-release`: triggers a release (used in CI)
