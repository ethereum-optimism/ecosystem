# `@eth-optimism/ui-components`

This is the `ui-components` package, a comprehensive library of components built to speed up development for builders on the Superchain. Built on top of the popular `shadcn` framework, this library leverages the power of React, Tailwind CSS, and TypeScript to provide a robust and flexible set of components.

See shadcn/ui docs: https://ui.shadcn.com/docs

## Getting Started

Web applications can benefit from components in the `ui-components` package with the following prerequisites:

- The application must be written in react + typescript
- The application must have tailwind.css set up

The component library works very similarly to shadcn in the sense that it is not bundled + published to npm, rather users can simply pick the components they’d like to use in their applications via copy + pasting the source code directly.

The source code for the components live under the `eth-optimism/ui-components/src/components/ui` directory.

## Setting up the component library in an application in the ecosystem repo

1. Set up tailwind.css in the application if you have not already done so. Setup guide can be found here: https://tailwindcss.com/docs/installation
2. In the `package.json` add this line to your `dependencies`

```json
"@eth-optimism/ui-components": "*",
```

1. In the `global.css` file add this line to the top

```
@import '@eth-optimism/ui-components/src/style.css';
```

1. In the `tailwind.config.ts` add this line to the `content`

```
'./node_modules/@eth-optimism/ui-components/src/**/*.{ts,tsx}',
```

## Setting up the component library for applications outside the ecosystem repo

1. Follow the shadcn/ui docs for getting started with shadcn. Since the component library is built on top of shadcn, the majority of the setup work is identical to setting up shadcn in your application.
2. Copy the values inside `@eth-optimism/ui-components/src/style.css` to your styles file.
3. Replace the components in your `ui` folder with the desired component within the `eth-optimism/ui-components/src/components/ui` directory.

## Documentation

Documentation for the components in the `ui-components` package can be found on our storybook site or by following the shadcn docs directly.

## Storybook

In order to see a live representation of the component library, see our storybook site here:

https://storybook-component-library.netlify.app