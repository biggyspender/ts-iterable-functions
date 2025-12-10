**Transformer Documentation Tasks**

- Goal: update each transformer in `src/transformers/` to use a consistent JSDoc style matching the pattern introduced in `aggregate.ts` and applied to `append.ts`, `average.ts`, and `concat.ts`.
- Style requirements:
	- Remove any existing comments and rewrite JSDoc blocks from scratch.
	- Document the internal `_function` with a summary, generic type parameters, parameter details, return description, notable error cases, and two example snippets (direct usage and curried `deferP0` usage via `pipeInto`).
	- Avoid documenting the exported `const` that wraps `deferP0`; only document the `_function`.
	- Keep language clear and actionable for readers; follow the exact tone and structure used in the already completed files.
- Process: work through the list below sequentially, updating each transformer file and marking the entry with `- done` once finished.

aggregate.ts - done

append.ts - done

average.ts - done

concat.ts - done

count.ts

defaultIfEmpty.ts

distinct.ts

distinctBy.ts

elementAt.ts

every.ts

except.ts

first.ts

firstOrDefault.ts

flatMap.ts

flatten.ts

forEach.ts

fullOuterGroupJoin.ts

fullOuterJoin.ts

groupAdjacent.ts

groupBy.ts

groupJoin.ts

indexed.ts

intersect.ts

isSubsetOf.ts

isSupersetOf.ts

join.ts

last.ts

lastOrDefault.ts

leftOuterJoin.ts

map.ts

max.ts

maxBy.ts

min.ts

minBy.ts

orderBy.ts

orderByDescending.ts

prepend.ts

reverse.ts

sequenceEqual.ts

single.ts

singleOrDefault.ts

skip.ts

skipWhile.ts

some.ts

sum.ts

take.ts

takeWhile.ts

thenBy.ts

thenByDescending.ts

toArray.ts

union.ts

unwrapIndexed.ts

zip.ts

zipAll.ts

zipAllToTuple.ts

zipMap.ts