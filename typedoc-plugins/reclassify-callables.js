"use strict";

import {
    Converter,
    DeclarationReflection,
    ReflectionKind,
    ReflectionType,
    ReferenceType,
    SignatureReflection,
    ParameterReflection,
    TypeParameterReflection,
    ReflectionFlag,
    Comment,
    CommentTag,
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
 * @param {import("typedoc").SomeType | undefined} type
 * @param {import("typedoc").Reflection | undefined} parent
 * @returns {import("typedoc").SomeType | undefined}
 */
function cloneType(type, parent) {
    if (!type) {
        return type;
    }

    if (type instanceof ReflectionType) {
        const declaration = type.declaration;
        const clonedDeclaration = cloneDeclaration(declaration, parent);
        return new ReflectionType(clonedDeclaration);
    }

    return type;
}

/**
 * @param {DeclarationReflection} declaration
 * @param {import("typedoc").Reflection | undefined} parent
 */
function cloneDeclaration(declaration, parent) {
    const cloned = new DeclarationReflection(declaration.name, declaration.kind, parent);
    cloned.comment = declaration.comment;
    cloned.sources = declaration.sources;
    cloned.defaultValue = declaration.defaultValue;
    copyFlags(declaration, cloned);

    if (Array.isArray(declaration.typeParameters)) {
        cloned.typeParameters = declaration.typeParameters.map((tp) => cloneTypeParameter(tp, cloned));
    }

    if (Array.isArray(declaration.signatures)) {
        cloned.signatures = declaration.signatures.map((signature) => cloneSignature(signature, cloned));
    }

    if (Array.isArray(declaration.children)) {
        cloned.children = declaration.children.map((child) => cloneDeclaration(child, cloned));
    }

    if (declaration.type) {
        cloned.type = cloneType(declaration.type, cloned);
    }

    return cloned;
}

/**
 * @param {SignatureReflection} signature
 * @param {DeclarationReflection} parent
 */
function cloneSignature(signature, parent) {
    const cloned = new SignatureReflection(signature.name, signature.kind, parent);
    cloned.comment = signature.comment;
    cloned.sources = signature.sources;
    copyFlags(signature, cloned);

    if (Array.isArray(signature.typeParameters)) {
        cloned.typeParameters = signature.typeParameters.map((tp) => cloneTypeParameter(tp, cloned));
    }

    if (Array.isArray(signature.parameters)) {
        cloned.parameters = signature.parameters.map((parameter) => cloneParameter(parameter, cloned));
    }

    cloned.type = cloneType(signature.type, cloned);

    return cloned;
}

/**
 * @param {ParameterReflection} parameter
 * @param {SignatureReflection} parent
 */
function cloneParameter(parameter, parent) {
    const cloned = new ParameterReflection(parameter.name, parameter.kind, parent);
    cloned.comment = parameter.comment;
    cloned.sources = parameter.sources;
    cloned.defaultValue = parameter.defaultValue;
    copyFlags(parameter, cloned);
    cloned.type = cloneType(parameter.type, cloned);
    return cloned;
}

/**
 * @param {TypeParameterReflection} typeParameter
 * @param {import("typedoc").Reflection} parent
 */
function cloneTypeParameter(typeParameter, parent) {
    const cloned = new TypeParameterReflection(typeParameter.name, parent, typeParameter.varianceModifier);
    cloned.comment = typeParameter.comment;
    cloned.sources = typeParameter.sources;
    cloned.type = cloneType(typeParameter.type, cloned);
    cloned.default = cloneType(typeParameter.default, cloned);
    copyFlags(typeParameter, cloned);
    return cloned;
}

/**
 * Copies reflection flags from one reflection to another.
 * @param {import("typedoc").Reflection} source
 * @param {import("typedoc").Reflection} target
 */
function copyFlags(source, target) {
    for (const value of Object.values(ReflectionFlag)) {
        if (typeof value !== "number" || value === ReflectionFlag.None) {
            continue;
        }

        if (source?.flags?.hasFlag?.(value)) {
            target.setFlag(value, true);
        }
    }
}

/**
 * Applies `@param` and `@typeParam` tag comments to cloned reflections.
 * @param {SignatureReflection} signature
 * @param {import("typedoc").Comment | undefined} comment
 */
function applyTagComments(signature, comment) {
    if (!comment || !Array.isArray(comment.blockTags)) {
        return;
    }

    for (const tag of comment.blockTags) {
        if (!tag) {
            continue;
        }

        if ((tag.tag === "@param" || tag.tag === "@arg" || tag.tag === "@argument") && tag.name) {
            const parameter = signature.parameters?.find((param) => param.name === tag.name);
            if (!parameter) {
                continue;
            }

            parameter.comment =
                parameter.comment ?? new Comment(Comment.cloneDisplayParts(tag.content ?? []), []);
        }

        if ((tag.tag === "@typeParam" || tag.tag === "@template") && tag.name) {
            const typeParam = signature.typeParameters?.find((param) => param.name === tag.name);
            if (!typeParam) {
                continue;
            }

            typeParam.comment =
                typeParam.comment ?? new Comment(Comment.cloneDisplayParts(tag.content ?? []), []);
        }
    }
}

/**
 * Attempts to rewrite a `deferP0` curried helper into a readable signature.
 * @param {DeclarationReflection} reflection
 * @param {import("typedoc").ProjectReflection} project
 */
function tryConvertDeferP0(reflection, project) {
    if (!(reflection.type instanceof ReflectionType)) {
        return;
    }

    const outerDeclaration = reflection.type.declaration;
    const outerSignature = outerDeclaration?.signatures?.[0];
    if (!outerSignature) {
        return;
    }

    const restParameter = outerSignature.parameters?.[0];
    if (!restParameter || !restParameter.flags?.isRest) {
        return;
    }

    const tupleType = restParameter.type;
    if (!tupleType || tupleType.type !== "tuple" || !Array.isArray(tupleType.elements)) {
        return;
    }

    const innerType = outerSignature.type;
    if (!(innerType instanceof ReflectionType)) {
        return;
    }

    const innerDeclaration = innerType.declaration;
    if (!innerDeclaration?.signatures?.length) {
        return;
    }

    const sourceFile = outerSignature.sources?.[0]?.fileName ?? "";
    if (!sourceFile.includes("deferP0")) {
        return;
    }

    const signature = new SignatureReflection(reflection.name, ReflectionKind.CallSignature, reflection);

    if (reflection.comment) {
        signature.comment = reflection.comment;
        reflection.comment = undefined;
    } else if (outerSignature.comment) {
        signature.comment = outerSignature.comment;
    }

    copyFlags(outerSignature, signature);

    if (Array.isArray(outerSignature.typeParameters)) {
        signature.typeParameters = outerSignature.typeParameters.map((tp) => cloneTypeParameter(tp, signature));
    }

    signature.parameters = tupleType.elements.map((element, index) => {
        const name = element?.name ?? `arg${index}`;
        const parameter = new ParameterReflection(name, ReflectionKind.Parameter, signature);
        if (element?.isOptional) {
            parameter.setFlag(ReflectionFlag.Optional, true);
        }
        parameter.sources = restParameter.sources;
        parameter.type = cloneType(element?.element ?? element, parameter);
        return parameter;
    });

    applyTagComments(signature, signature.comment ?? outerSignature.comment);

    const companion = findCompanionReflection(reflection, project);
    if (companion?.isDeclaration?.()) {
        const companionSignature = companion.signatures?.[0];
        if (companionSignature) {
            applyCompanionComments(companionSignature, signature);
        }
    }

    const companionName = companion?.name ?? `_${reflection.name}`;
    appendCurriedVersionNote(signature, companionName);

    const returnDeclaration = cloneDeclaration(innerDeclaration, signature);
    signature.type = new ReflectionType(returnDeclaration);

    project.removeTypeReflections?.(reflection.type);
    reflection.type = undefined;
    reflection.signatures = [signature];
}

/**
 * Attempts to locate the underscore-prefixed implementation used to build a curried export.
 * @param {DeclarationReflection} reflection
 * @param {import("typedoc").ProjectReflection} project
 */
function findCompanionReflection(reflection, project) {
    const targetName = `_${reflection.name}`;
    const path = [targetName];

    let scope = reflection.parent;
    while (scope) {
        if (typeof scope.getChildByName === "function") {
            const found = scope.getChildByName(path);
            if (found) {
                return found;
            }
        }
        scope = scope.parent;
    }

    return project.getChildByName(path);
}

/**
 * Copies parameter and type parameter comments from the implementation signature to the curried signature.
 * @param {SignatureReflection} source
 * @param {SignatureReflection} target
 */
function applyCompanionComments(source, target) {
    if (source.comment && !target.comment) {
        target.comment = cloneComment(source.comment);
    }

    if (Array.isArray(source.parameters) && Array.isArray(target.parameters)) {
        for (const parameter of source.parameters) {
            const targetParameter = target.parameters.find((param) => param.name === parameter.name);
            if (targetParameter && parameter.comment && !targetParameter.comment) {
                targetParameter.comment = cloneComment(parameter.comment);
            }
        }
    }

    if (Array.isArray(source.typeParameters) && Array.isArray(target.typeParameters)) {
        for (const typeParam of source.typeParameters) {
            const targetTypeParam = target.typeParameters.find((param) => param.name === typeParam.name);
            if (targetTypeParam && typeParam.comment && !targetTypeParam.comment) {
                targetTypeParam.comment = cloneComment(typeParam.comment);
            }
        }
    }
}

/**
 * Produces a deep clone of a comment to avoid mutating shared references.
 * @param {Comment | undefined} comment
 * @returns {Comment | undefined}
 */
function cloneComment(comment) {
    if (!comment) {
        return comment;
    }

    const cloned = new Comment(Comment.cloneDisplayParts(comment.summary ?? []), []);

    if (Array.isArray(comment.blockTags)) {
        cloned.blockTags = comment.blockTags.map((tag) =>
            typeof tag.clone === "function"
                ? tag.clone()
                : new CommentTag(tag.tag, tag.name, Comment.cloneDisplayParts(tag.content ?? []))
        );
    }

    if (comment.modifierTags) {
        cloned.modifierTags = new Set(comment.modifierTags);
    }

    return cloned;
}

/**
 * Appends a "Curried version" note to the signature summary so output docs highlight the relationship.
 * @param {SignatureReflection} signature
 * @param {string} companionName
 */
function appendCurriedVersionNote(signature, companionName) {
    const existing = signature.comment;
    const comment = existing ? cloneComment(existing) : new Comment([], []);
    signature.comment = comment;
    const summary = comment.summary ?? (comment.summary = []);

    const exists = summary.some(
        (part) => typeof part?.text === "string" && part.text.includes("Curried version of ")
    );

    if (exists) {
        return;
    }

    const prefix = summary.length > 0 ? "\n\n" : "";
    summary.push({ kind: "text", text: `${prefix}Curried version of \`${companionName}\`.` });
}

/**
 * Rewrites signatures for exports tagged with {@link CURRIED_FROM_TAG} so
 * documentation reflects the curried parameter order.
 * @param {import("typedoc").ProjectReflection} project
 */
function applyCurriedFrom(project) {
    const functions = project.getReflectionsByKind(ReflectionKind.Function);

    for (const reflection of functions) {
        if (!reflection.isDeclaration?.()) {
            continue;
        }

        tryConvertDeferP0(reflection, project);
    }
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

        applyCurriedFrom(project);
        reorderFunctionGroups(project);
    });

    app.renderer.on(PageEvent.BEGIN, (page) => {
        if (page.model) {
            reorderFunctionGroups(page.model);
        }
    });
}
