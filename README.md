# ts-iterable-functions

A collection of type-safe functions for operating over iterable sequences, with specialized versions that generate unary functions for use in pipes. Will feel immediately familiar for users of MS LINQ-to-objects.

[![npm version](https://img.shields.io/npm/v/ts-iterable-functions.svg?style=flat)](https://npmjs.org/package/ts-iterable-functions "View this project on npm")
[![Build Status](https://travis-ci.org/biggyspender/ts-iterable-functions.svg?branch=master)](https://travis-ci.org/biggyspender/ts-iterable-functions)

## Usage

Let's make a collection of cars

```typescript
const cars = [{
    manufacturer:"Ford",
    model:"Escort"
  },{
    manufacturer:"Ford",
    model:"Cortina"
  },{
    manufacturer:"Renault",
    model:"Clio"
  },{
    manufacturer:"Vauxhall",
    model:"Corsa"
  },{
    manufacturer:"Ford",
    model:"Fiesta"
  },{
    manufacturer:"Fiat",
    model:"500"
  }
];
```

...and sort them by manufacturer, and then by model:

```typescript
const orderedCars = pp(
  cars,
  orderBy(c => c.manufacturer),
  thenBy(c => c.model),
  toArray()
);
```

Or we could count the number of cars for each manufacturer:

```typescript
const carsPerManufacturer = pp(
  cars,
  groupBy(c => c.manufacturer),
  map(g => ({
    count: _count(g),
    manufacturer: g.key
  })),
  orderByDescending(c => c.count),
  thenBy(c => c.manufacturer)
);
for(var c of carsPerManufacturer){
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
const src = [1, 2, 3]
```

We can use the `_map` function to transform this as follows:

```typescript
const times2 = _map(src, x => x + x)
```

### Two forms of the same function

All of the functions that transform iterables in this library exist in two forms. 

The first form is the one we used above and looks like this:

```typescript
function _someOperator<T, A, B, R>(src: T, a: A, b: B): R
```

and by convention is prefixed with an `_underscore`. While handy in their own way, composing these functions is ugly.

```typescript
//this looks awful
const times2squared = _map(_map(src, x => x + x), x => x * x)
```

### The pipeable function

If, instead, we had functions that look like this

```typescript
function someOperator<T, A, B, R>(a: A, b: B): (src: T) => R
```

where the function returns a ***unary*** function of the form `(src: T) => R`, we can use them in pipes (where the output of one function is fed in to the input of the next function).

In fact, we can transform `_someOperator` into `someOperator` (preserving all type information) with the [`deferP0`](https://github.com/biggyspender/ts-functional-pipe/blob/master/src/deferP0.ts) function (from [ts-functional-pipe](https://github.com/biggyspender/ts-functional-pipe)):

```typescript
const deferP0 = <P0, A extends any[], R>(fn: (src: P0, ...args: A) => R) => (...args: A) => (
  src: P0
): R => fn(src, ...args)
```

so, we could take the `_map` function above and transform it into the pipeable form with a simple call to `deferP0(_map)`.

All functions that transform `Iterable<T>` in the library exist in the two forms. So, for instance the map function exists as `_map` and `map`. Moving forward, we'll be avoiding the `_underscored` functions.

## Usage with pipes

This library re-exports the `pp/pipeInto, pipeValue, compose & typedCompose` functions from [ts-functional-pipe](https://github.com/biggyspender/ts-functional-pipe), and there is good information about how these work in the [`README`](https://github.com/biggyspender/ts-functional-pipe/blob/master/README.md) over there.

### Making `times2squared` readable

Let's use `pp` to pipe our iterable into a chain of unary functions, generated (in this case) using the `map` function discussed above:

```typescript
const src = [1, 2, 3]
const times2squared = pp(
    src,
    map(x => x + x),
    map(x => x * x)
)
```

## Types in the pipe are preserved

Due to some funky type-definitions in [ts-functional-pipe](https://github.com/biggyspender/ts-functional-pipe), types flow through the pipe nicely:

```typescript
const src = [1, 2, 3]
const toStringRepeated = pp(
    src,
    map(x => x.toString()), // here x is number
    map(s => s + s)         // here s is string
)                           // returns a string
```

and all types are correctly inferred.

More coming soon...

## Generators


`range`, `repeat`, `repeatGenerate`


## Transformers


`aggregate`, `all`/`every`, `append`, `average`, `concat`, `count`, `defaultIfEmpty`, `distinctBy`, `distinct`, `elementAt`, `except`, `firstOrDefault`, `first`, `flatten`, `forEach`, `fullOuterGroupJoin`, `fullOuterJoin`, `groupAdjacent`, `groupBy`, `groupJoin`, `intersect`, `isSubsetOf`, `isSupersetOf`, `join`, `lastOrDefault`, `last`, `leftOuterJoin`, `maxBy`, `max`, `minBy`, `min`, `orderByDescending`, `orderBy`, `preprend`, `reduce`, `reduceRight`, `reverse`, `selectMany`/`flapMap`, `select`/`map`, `sequenceEqual`, `singleOrDefault`, `single`, `skip`, `skipWhile`, `some`, `sum`, `take`, `takeWhile`, `thenByDescending`, `thenBy`, `toArray`, `toLookup`, `toMap`, `toSet`, `union`, `where`/`filter`, `zipAll`, `zip`


### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
