# Getting Started

Follow this small step-by-step guide to start using Inversiland in your project.

## Table of Contents

- [Installation](#installation)
- [Define a Scoped Module](#define-a-scoped-module)
- [Entrypoint](#entrypoint)

## Installation

Add the `inversiland` package to your project.

```bash
#pnpm
pnpm add inversiland
```

```bash
# yarn
yarn add inversiland
```

```bash
# npm
npm install inversiland
```

- The `inversify` package is already included within `inversiland` to expose only what is necessary.
- Inversiland installs and imports the `reflect-metadata` package under the hood, so we don't have to worry about adding any extra steps.

⚠️ **Important!** InversifyJS requires TypeScript >= 4.4 and the `experimentalDecorators`, `emitDecoratorMetadata` compilation options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Define a Scoped Module

All dependencies defined in the `providers` field of this module are only visible to each other.

We can understand each module more or less as a compartmentalized container of Inversify. We will explain this later.

```typescript
import { module } from "inversiland";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  providers: [CatsController, CatsService],
})
export class CatsModule {}
```

## Entrypoint

Define a root module, `AppModule`, for your application and import the previously defined CatsModule.

```typescript
import { module } from "inversiland";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

Choose the newly defined `AppModule` as the entry point of the dependency system.

```typescript
import { Inversiland } from "inversiland";
import { AppModule } from "./AppModule";

// Configure the Inversiland instance
Inversiland.options.logLevel =
  process.env.NODE_ENV === "development" ? "debug" : "info";
Inversiland.options.defaultScope = "Singleton";

// Entrypoint
Inversiland.run(AppModule);
```

And that's it!

You can now start injecting your dependencies where you need them.
