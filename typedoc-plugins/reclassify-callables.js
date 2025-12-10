"use strict";

import {
    Converter,
    DeclarationReflection,
    Reflection,
    ReflectionKind,
    ReflectionType,
    ReferenceType,
    PageEvent,
} from "typedoc";

/**
 * Detects whether a TypeDoc type node describes something callable.
 * Walks into reflection and reference types so we catch arrow functions,
 * type literals, and re-exported call signatures.
 * @param {import("typedoc").SomeType | undefined} type
 * @returns {boolean}
 */
function typeHasCallSignature(type) {
    if (!type) {
        return false;
    }

    if (type instanceof ReflectionType) {
        return declarationHasSignature(type.declaration);
    }

    if (type instanceof ReferenceType && type.reflection) {
        return declarationHasSignature(type.reflection);
    }

    if (Array.isArray(type.types)) {
        return type.types.some(typeHasCallSignature);
    }

    if (Array.isArray(type.elements)) {
        return type.elements.some(typeHasCallSignature);
    }

    return false;
}

/**
 * @param {DeclarationReflection | undefined} declaration
 * @returns {boolean}
 */
function declarationHasSignature(declaration) {
    if (!declaration) {
        return false;
    }

    return (
        declaration instanceof DeclarationReflection &&
        Array.isArray(declaration.signatures) &&
        declaration.signatures.length > 0
    );
}

/**
 * Ensures function-like reflections are sorted with non-prefixed names before
 * their underscore-prefixed counterparts.
 * @param {import("typedoc").ContainerReflection | undefined} reflection
 */
function reorderFunctionGroups(reflection) {
    if (!reflection) {
        return;
    }

    if (reflection.groups) {
        for (const group of reflection.groups) {
            if (!Array.isArray(group.children) || group.children.length === 0) {
                continue;
            }

            const targetChildren = group.children.filter(isFunctionReflection);
            if (targetChildren.length <= 1) {
                continue;
            }

            const sorted = [...targetChildren].sort(compareFunctionNames);
            let index = 0;

            group.children = group.children.map((child) =>
                isFunctionReflection(child) ? sorted[index++] : child
            );
        }
    }

    if (reflection.children && reflection.children.length > 0) {
        const functionChildren = reflection.children.filter(isFunctionReflection);
        if (functionChildren.length > 1) {
            const sorted = [...functionChildren].sort(compareFunctionNames);
            let index = 0;

            reflection.children = reflection.children.map((child) =>
                isFunctionReflection(child) ? sorted[index++] : child
            );
        }

        for (const child of reflection.children) {
            reorderFunctionGroups(child);
        }
    }
}

/**
 * @param {Reflection | undefined} reflection
 */
function isFunctionReflection(reflection) {
    return Boolean(reflection && reflection.kind === ReflectionKind.Function);
}

/**
 * @param {Reflection} a
 * @param {Reflection} b
 */
function compareFunctionNames(a, b) {
    const nameA = a?.name ?? "";
    const nameB = b?.name ?? "";
    const underscoreA = nameA.startsWith("_");
    const underscoreB = nameB.startsWith("_");

    if (underscoreA !== underscoreB) {
        return underscoreA ? 1 : -1;
    }

    return nameA.localeCompare(nameB);
}

/**
 * TypeDoc plugin entry point.
 * @param {import("typedoc").Application} app
 */
export function load(app) {
    app.converter.on(Converter.EVENT_RESOLVE_END, (context) => {
        const project = context.project;
        const variables = project.getReflectionsByKind(ReflectionKind.Variable);

        for (const reflection of variables) {
            if (!typeHasCallSignature(reflection.type)) {
                continue;
            }

            reflection.kind = ReflectionKind.Function;
            reflection.kindString = "Function";
        }

        reorderFunctionGroups(project);
    });

    app.renderer.on(PageEvent.BEGIN, (page) => {
        if (page.model) {
            reorderFunctionGroups(page.model);
        }
    });
}
