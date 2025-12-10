**Transformer Documentation Tasks**

- Goal: update each transformer in `src/transformers/` so its `_function` JSDoc matches the refreshed pattern now present in `aggregate.ts`, `append.ts`, `average.ts`, and `concat.ts`.
- Style requirements:
	- Remove any existing comments on the `_function` and rewrite the JSDoc from scratch.
	- Provide a concise summary, list generic type parameters when present, describe each parameter and the return value, call out error conditions, and include two fenced `ts` examples: direct invocation and `pipeInto` with the curried helper.
	- Document the curried export with a one-line block comment reading `Curried version of {@link _FunctionName}.` exactly, matching the existing pattern.
	- Mirror the tone and section ordering used in the updated files; use the same wording for example headings (“or using the curried version:”) and keep descriptions one sentence where practical.
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