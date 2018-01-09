# Siren State
> Simple client-side solution for modeling, transforming, and consuming a Siren API

[Siren](https://github.com/kevinswiber/siren) is a hypermedia specification for representing entities. When consuming the output of a Siren API, the entities are highly structured, but may lead to repetitive boilerplate when modeling & consuming entities on the client-side. This library seeks to eliminate boilerplate, and help establish a foundation for modeling more complex domain models and interactions on top of Siren entities.

> 💡 This library is built in a way that allows easy extension, offers opt-in immutability, and favors sane defaults. Though vanilla use is possible, extension is encouraged to cater to your particular modeling strategy. [[TODO]Learn more about the extension points and hooks ➡️ ]()

## Assumptions
`siren-state` makes some assumptions about both you and the Siren API you are consuming:
1. You have a solid understanding of the [Siren Hypermedia specification](https://github.com/kevinswiber/siren).
Much of the specification is referenced, but not explained in detail, throughout the documentation.
1. Your client is consuming a spec-compliant Siren API. The behavior of non-spec-compliant Siren APIs with this library is undefined.
1. Your entities generally only have a single `class` (multiple classes _are_ allowed by the spec but may complicate design).
1. Your client interaction is based on HTTP, which is the only protocol currently supported by the library.

## Installation

```shell
yarn add siren-state
npm install siren-state
```

## Overview
The `siren-state` module exposes three primary components for dealing with Siren APIs:
1. [Modeling](docs/Modeling.md) — Defining domain models which correspond to Siren entities and their relationships
2. [Actions](docs/Actions.md) — Performing Siren actions
3. [Stores](docs/Stores.md) — Accessing domain models

> 💡 Sometimes the best way is to learn is by example: check out the `examples` directory for concrete implementations of these concepts.

## Developing

### Built With
TypeScript & VS Code

### Setting up Dev

```bash
git clone https://github.com/MarkLeMerise/siren-state
cd siren-state/
yarn install
```

## Testing

```bash
yarn test # Run tests with coverage report
yarn test:watch # Run tests continuously while developing
```

## Style guide

This project uses TSLint. Run `yarn lint` to see an error report, and `yarn lint:fix` to both the report and fix existing errors.

## Versioning

[Semantic Versioning](http://semver.org/)

## Licensing

MIT
