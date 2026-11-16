## Context

`src/documents.ts` holds a strict model per document and derives the published schemas; each schema has its address as `$id`. The documents carry no reference to it.

## Goals / Non-Goals

**Goals:**
- A document says which schema describes it.
- The address in the document and the `$id` of the schema cannot differ.

**Non-Goals:**
- A version in the address.
- Validating a document against its schema before printing it.

## Decisions

**The key is `$schema`, first in the document.** It is the key JSON tooling reads: editors fetch the schema it names, validators can be told to follow it. First, because a reader looks there.

**Its value is the `$id` of the schema.** One function, `schemaOf(name)`, gives both: the address written in a document is the address its schema declares.

**The model fixes the value.** Each model declares `$schema` as the literal address, so the published schema states it as a constant: a `plan` document validated against the schema of `check` fails on its first key, with a message that names both.

**The error document carries it too.** It is a document like the others, and the one a program is least prepared for.

## Risks / Trade-offs

- The address points to `main`, which may describe a later version. → As decided for the schemas themselves: they accept unknown keys, and the installed package holds the exact files.
- If the address ever changes, a document of an older version fails the constant of a newer schema. → The address is a file name in a repository, chosen to stay; moving it would be a breaking change, announced as one.
