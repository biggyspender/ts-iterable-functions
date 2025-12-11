"use strict";

import {
    Converter,
    ParameterType,
    ReflectionKind,
    PageEvent,
    RendererEvent,
} from "typedoc";

const OPTION_ORDER = "customSortOrder";
const OPTION_KINDS = "customSortKinds";
const OPTION_UNDERSCORE_LAST = "customSortUnderscoreLast";

/**
 * @param {import("typedoc").Application} app
 */
export function load(app) {
    app.options.addDeclaration({
        name: OPTION_ORDER,
        help: "Names to float to the top when sorting reflections.",
        type: ParameterType.Array,
    });

    app.options.addDeclaration({
        name: OPTION_KINDS,
        help: "Reflection kinds (e.g. Function, Class) that should be custom sorted.",
        type: ParameterType.Array,
        defaultValue: ["Function"],
    });

    app.options.addDeclaration({
        name: OPTION_UNDERSCORE_LAST,
        help: "Whether underscore-prefixed names should be moved after non-prefixed names.",
        type: ParameterType.Boolean,
        defaultValue: true,
    });

    app.converter.on(Converter.EVENT_END, (context) => {
        const options = buildOptions(app);
        applyCustomSort(context.project, options);
    });

    app.renderer.on(PageEvent.BEGIN, (page) => {
        if (!page.model) {
            return;
        }

        const options = buildOptions(app);
        applyCustomSort(page.model, options);
    });

    app.renderer.on(RendererEvent.BEGIN, (event) => {
        if (!event.project) {
            return;
        }

        const options = buildOptions(app);
        applyCustomSort(event.project, options);
    });
}

/**
 * @param {import("typedoc").Application} app
 */
function buildOptions(app) {
    /** @type {string[]} */
    const preferred = (app.options.getValue(OPTION_ORDER) ?? []).filter(Boolean);
    /** @type {string[]} */
    const kindNames = (app.options.getValue(OPTION_KINDS) ?? []).filter(Boolean);
    const underscoreLast = app.options.getValue(OPTION_UNDERSCORE_LAST) !== false;

    const kinds = resolveKinds(kindNames);
    const compare = createComparator(preferred, underscoreLast);

    return {
        compare,
        predicate: (reflection) => shouldSort(reflection, kinds),
    };
}

/**
 * @param {string[]} names
 * @returns {Set<number>}
 */
function resolveKinds(names) {
    const resolved = new Set();

    if (!Array.isArray(names) || names.length === 0) {
        resolved.add(ReflectionKind.Function);
        return resolved;
    }

    for (const name of names) {
        if (typeof name !== "string") {
            continue;
        }

        const trimmed = name.trim();
        if (!trimmed) {
            continue;
        }

        const candidate = ReflectionKind[trimmed];
        if (typeof candidate === "number") {
            resolved.add(candidate);
        }
    }

    if (resolved.size === 0) {
        resolved.add(ReflectionKind.Function);
    }

    return resolved;
}

/**
 * @param {import("typedoc").Reflection} root
 * @param {{ compare: (a: import("typedoc").Reflection, b: import("typedoc").Reflection) => number; predicate: (reflection: import("typedoc").Reflection) => boolean; }} options
 */
function applyCustomSort(root, options) {
    if (!root) {
        return;
    }

    if (Array.isArray(root.groups)) {
        for (const group of root.groups) {
            if (!Array.isArray(group.children) || group.children.length <= 1) {
                continue;
            }

            const reordered = reorderSubset(group.children, options.predicate, options.compare);
            if (reordered) {
                group.children = reordered;
            }

            if (Array.isArray(group.categories)) {
                for (const category of group.categories) {
                    if (!Array.isArray(category.children) || category.children.length <= 1) {
                        continue;
                    }

                    const reorderedCategory = reorderSubset(
                        category.children,
                        options.predicate,
                        options.compare
                    );
                    if (reorderedCategory) {
                        category.children = reorderedCategory;
                    }
                }
            }
        }
    }

    if (Array.isArray(root.children) && root.children.length > 0) {
        const reorderedChildren = reorderSubset(root.children, options.predicate, options.compare);
        if (reorderedChildren) {
            root.children = reorderedChildren;
        }

        for (const child of root.children) {
            if (isContainer(child)) {
                applyCustomSort(child, options);
            }
        }
    }

    if (Array.isArray(root.childrenIncludingDocuments) && root.childrenIncludingDocuments.length > 0) {
        const reorderedAllChildren = reorderSubset(
            root.childrenIncludingDocuments,
            options.predicate,
            options.compare
        );
        if (reorderedAllChildren) {
            root.childrenIncludingDocuments = reorderedAllChildren;
        }
    }

    if (Array.isArray(root.categories)) {
        for (const category of root.categories) {
            if (!Array.isArray(category.children) || category.children.length <= 1) {
                continue;
            }

            const reorderedCategory = reorderSubset(
                category.children,
                options.predicate,
                options.compare
            );
            if (reorderedCategory) {
                category.children = reorderedCategory;
            }
        }
    }
}

/**
 * @param {import("typedoc").Reflection} reflection
 */
function isContainer(reflection) {
    return Boolean(
        reflection &&
        (Array.isArray(reflection.children) && reflection.children.length > 0 ||
            Array.isArray(reflection.groups) && reflection.groups.length > 0)
    );
}

/**
 * @param {import("typedoc").Reflection[]} source
 * @param {(reflection: import("typedoc").Reflection) => boolean} predicate
 * @param {(a: import("typedoc").Reflection, b: import("typedoc").Reflection) => number} compare
 * @returns {import("typedoc").Reflection[] | undefined}
 */
function reorderSubset(source, predicate, compare) {
    const targets = source.filter(predicate);
    if (targets.length <= 1) {
        return undefined;
    }

    const sorted = [...targets].sort(compare);
    let index = 0;
    let mutated = false;

    const next = source.map((reflection) => {
        if (!predicate(reflection)) {
            return reflection;
        }

        const replacement = sorted[index++];
        if (!mutated && replacement !== reflection) {
            mutated = true;
        }
        return replacement;
    });

    return mutated ? next : undefined;
}

/**
 * @param {import("typedoc").Reflection} reflection
 * @param {Set<number>} kinds
 */
function shouldSort(reflection, kinds) {
    if (!reflection || typeof reflection.kind !== "number") {
        return false;
    }

    for (const kind of kinds) {
        if ((reflection.kind & kind) !== 0) {
            return true;
        }
    }

    return false;
}

/**
 * @param {string[]} preferred
 * @param {boolean} underscoreLast
 */
function createComparator(preferred, underscoreLast) {
    const ranks = new Map();
    preferred.forEach((name, index) => {
        ranks.set(name, index);
    });

    return (a, b) => {
        const nameA = getName(a);
        const nameB = getName(b);

        const rankA = ranks.get(nameA);
        const rankB = ranks.get(nameB);

        if (rankA !== undefined || rankB !== undefined) {
            if (rankA === undefined) {
                return 1;
            }

            if (rankB === undefined) {
                return -1;
            }

            if (rankA !== rankB) {
                return rankA - rankB;
            }
        }

        if (underscoreLast) {
            const underscoreA = nameA.startsWith("_");
            const underscoreB = nameB.startsWith("_");
            if (underscoreA !== underscoreB) {
                return underscoreA ? 1 : -1;
            }
        }

        return nameA.localeCompare(nameB);
    };
}

/**
 * @param {import("typedoc").Reflection} reflection
 */
function getName(reflection) {
    return typeof reflection?.name === "string" ? reflection.name : "";
}
