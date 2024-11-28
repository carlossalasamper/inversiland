<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/v/inversify-sugar.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/l/inversify-sugar.svg" alt="Package License" /></a>

# Inversify Sugar

<p align="center">
  <img alt="Inversify Sugar banner" src="https://raw.githubusercontent.com/carlossalasamper/inversify-sugar/master/assets/images/inversify-sugar-banner.png" style="max-width: 900px; width: 100%;" />
</p>
<p align="center" style="margin-top: 10px;">🧁 <a href="https://inversify.io/">InversifyJS</a> framework to build hierarchical dependency systems with an elegant API.</p>

## Table of Contents

- [Introduction](#introduction)
  - [Other Dependency Systems](#other-dependency-systems)
  - [Inversify API Disadvantages](#inversify-api-disadvantages)
- [Changelog](#changelog)
- [Getting Started](#getting-started)
  - [1. Installation](#1-installation)
  - [2. Define a Scoped Module](#2-define-a-scoped-module)
  - [3. Entrypoint](#3-entrypoint)
- [Documentation](#documentation)
  - [Modules](#modules)
    - [Imports](#imports)
    - [Providers](#providers)
    - [Exports](#exports)
    - [Get the Container of a Module](#get-the-container-of-a-module)
    - [ModuleContainer](#modulecontainer)
    - [Dynamic Modules](#dynamic-modules)
      - [Combining Static and Dynamic Providers](#combining-static-and-dynamic-providers)
      - [Read More About Dynamic Modules](#read-more-about-dynamic-modules)
  - [Injection](#injection)
    - [Local Provider Injection](#local-provider-injection)
    - [Imported Provider Injection](#imported-provider-injection)
- [Testing](#testing)
- [Support the Project](#support-the-project)
- [License](#license)

## Introduction

Inversify Sugar is a set of decorators, types and functions built on top of a [custom fork of Inversify](https://github.com/carlossalasamper/InversifyJS) and offers an API to handle TypeScript applications with multiple dependency containers and relationships between them.

Let me illustrate with a comparison.

### Other Dependency Systems

Have you ever tried the [Angular](https://angular.io/)'s dependency injection system?

```typescript
import { NgModule } from "@angular/core";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@NgModule({
  declarations: [CatsController, CatsService],
})
export class CatsModule {}
```

```typescript
import { NgModule } from "@angular/core";
import { CatsModule } from "./cats/cats.module";

@NgModule({
  imports: [CatsModule],
})
export class AppModule {}
```

Or the [NestJS](https://nestjs.com/) one?

```typescript
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

```typescript
import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### Inversify API Disadvantages

Why can't we Inversify users organize our dependencies in such an elegant way?

This is how we have to write the same code in Inversify, with these 3 disadvantages:

- Your have to manage all the instantiated containers separately to scope the dependencies into modules (to build a hierarchical dependency system).
- Containers are initialized at the time the files that declare them are first imported.
- There is no single entry point to initialize all the containers.

```typescript
import { Container } from "inversify";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

const catsContainer = new Container();

catsContainer.bind(CatsController).toSelf().inSingletonScope();
catsContainer.bind(CatsService).toSelf().inSingletonScope();

export default catsContainer;
```

```typescript
import { Container } from "inversify";
import "./cats/catsContainer";

const container = new Container();

container.bind("DATABASE_URI").toConstantValue(process.env.DATABASE_URI);

export container;
```

> The result is a brittle dependency system that we can break just by changing the order of the imported files. And we have to handle all the containers manually.

**Inversify Sugar** is a framework built on top of Inversify with a clear objective: to offer an API on par with the most cutting-edge hierarchical dependency systems.

Once you try it you will no longer be able to live without it.

## Changelog

See the [list of changes](CHANGELOG.md) introduced in each release.

## Getting Started

Follow this small step-by-step guide to start using Inversify Sugar in your project.

### 1. Installation

Add the `inversify-sugar` package to your project.

Using yarn:

```bash
yarn inversify-sugar
```

Or using npm:

```bash
npm install inversify-sugar
```

- The `inversify` package is already included within `inversify-sugar` to expose only what is necessary.
- Inversify Sugar installs and imports the `reflect-metadata` package under the hood, so we don't have to worry about adding any extra steps.

⚠️ **Important!** InversifyJS requires TypeScript >= 4.4 and the `experimentalDecorators`, `emitDecoratorMetadata` compilation options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 2. Define a Scoped Module

All dependencies defined in the `providers` field of this module are only visible to each other.

We can understand each module more or less as a compartmentalized container of Inversify. We will explain this later.

```typescript
import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  providers: [CatsController, CatsService],
})
export class CatsModule {}
```

### 3. Entrypoint

Define a root module, `AppModule`, for your application and import the previously defined CatsModule.

```typescript
import { module } from "inversify-sugar";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

Choose the newly defined `AppModule` as the entry point of the dependency system.

```typescript
import { InversifySugar } from "inversify-sugar";
import { AppModule } from "./AppModule";

// Configure the InversifySugar instance
InversifySugar.options.debug = process.env.NODE_ENV === "development";
InversifySugar.options.defaultScope = "Singleton";

// Entrypoint
InversifySugar.run(AppModule);
```

And that's it!

You can now start injecting your dependencies where you need them.

## Documentation

Let's not forget that Inversify Sugar works on top of Inversify, so to understand what's going on behind the scenes, we'll be referencing [the original Inversify documentation](https://inversify.io/) throughout this guide.

Below you will find a detailed explanation of each of the concepts that this library handles together with different use examples and its public API.

### Modules

A module is a class annotated with a `@module()` decorator. The `@module()` decorator provides metadata that is used to organize the dependency system.

Each application has at least one module, a root module. The root module is normally called `AppModule` and is the starting point used to build the dependencies tree. While very small applications may theoretically have just the root module, for most applications, the resulting architecture will employ multiple modules, each encapsulating a closely related set of capabilities.

```typescript
import { module } from "inversify-sugar";
import CatsModule from "./cats/CatsModule";
import DogsModule from "./dogs/DogsModule";
import BirdsModule from "./birds/BirdsModule";

@module({
  imports: [CatsModule, DogsModule, BirdsModule],
  providers: [],
  exports: [],
})
export class AppModule {}
```

The relationship between modules would be as follows:

</br>

<div align="center">
<img src="./assets/images/inversify-sugar-modules.png" style="max-width: 900px; width: 100%;">
</div>

</br>

Once `AppModule` is defined, we will only have to call the `InversifySugar.run` method specifying the root module:

```typescript
import { InversifySugar } from "inversify-sugar";
import { AppModule } from "./AppModule";

InversifySugar.run(AppModule);
```

The module decorator accepts an object argument with the `imports`, `providers` and `exports` properties.

Next we will explain what each of these properties is for.

#### Imports

The list of imported modules that export the providers which are required in this module.

```typescript
@module({
  imports: [CatsModule],
})
export class AppModule {}
```

You can also use the `forRoot` pattern to generate [dynamic modules](#dynamic-modules) in the air and inject a configuration into the container.

The following example illustrates how we could inject a [Mongoose](https://mongoosejs.com/) database connection asynchronously from the options we pass as a parameter to the static `forRoot` method.

```typescript
@module({})
export default class MongooseModule {
  static forRoot(config: MongooseConnectionConfig): DynamicModule {
    const { uri, options } = config;

    return {
      module: MongooseModule,
      providers: [
        {
          provide: MongooseConnectionToken,
          useAsyncFactory: () => async () => {
            if (!mongoose.connection || mongoose.connection.readyState === 0) {
              await mongoose.connect(uri, options);
            }

            return mongoose.connection;
          },
          isGlobal: true,
        },
        {
          provide: MongooseConnectionConfigToken,
          useValue: config,
          isGlobal: true,
        },
      ],
    };
  }
}
```

Now we just need to import the dynamic module into the `AppModule` to globally provide the database connection and configuration.

```typescript
@module({
  imports: [MongooseModule.forRoot({ uri: process.env.MONGO_URI })],
})
export class AppModule {}
```

#### Providers

The providers that will be instantiated when the module is registered. These providers may be shared at least across this module.

You can define a provider in different ways depending on the desired instantiation method.

```typescript
@module({
  providers: [
    CatsService,
    {
      provide: CatsServiceToken,
      useClass: CatsService,
    },
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameFactoryToken,
      useFactory:
        (context) =>
        (...args) =>
          "New name",
    },
    {
      provide: Symbol(),
      useAsyncFactory: () => async () => {
        if (!mongoose.connection || mongoose.connection.readyState === 0) {
          await mongoose.connect(uri, options);
        }

        return mongoose.connection;
      },
    },
    {
      provide: "CATS_SERVICE_ALIAS",
      useExisting: CatsServiceToken,
    },
  ],
})
export class CatsModule {}
```

You can also add the `onActivation` and `onDeactivation` handlers to providers that need it. Check the [activation handler](https://github.com/inversify/InversifyJS/blob/master/wiki/activation_handler.md) and [deactivation handler](https://github.com/inversify/InversifyJS/blob/master/wiki/deactivation_handler.md) sections of Inversify documentation for more information.

> ⚠️ Remember that the `onDeactivation` handler will throw an error if we try to define it in a provider that does not have singleton scope.

#### Exports

The subset of providers that will be e available in other modules which import this module. You can use either a `ExportedProvider` object or just its token (provide value).

If you export a provider with an injection token that is not registeres as a provider, an error will be thrown.

```typescript
@module({
  providers: [
    CatsService,
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
  ],
  exports: [TestService, CatNameToken],
})
export class CatsModule {}
```

And you'll only need to change the decorator to `@multiInject` if you export more than one provider with the same `ServiceIdentifier`.

```typescript
@module({
  providers: [
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
    },
  ],
})
export class CatsModule {}
```

```bash
@multiInject(CatNameToken) = ["Toulouse", "Tomas O'Malley", "Duchess"]
```

And if you want to re-export providers with an identifier that have been imported into a module you must add the `deep` property.

```typescript
@module({
  providers: [
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
    },
  ],
})
export class CatsModule {}

@module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatNameToken,
      useValue: "Félix",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
      deep: true,
    },
  ],
})
export class MoreCatsModule {}
```

```bash
@multiInject(CatNameToken) = ["Toulouse", "Tomas O'Malley", "Duchess", "Félix"]
```

#### Get the Container of a Module

**Ideally we shouldn't be accessing module containers directly to get a service**. In either case, the `getModuleContainer` function allows you to get the container of a module in case you need to access it in an statement.

```typescript
import {
  getModuleContainer,
  module,
  injectable,
  InversifySugar,
} from "inversify-sugar";

@injectable()
class ProvidedService {}

@injectable()
class ExportedService {}

@module({
  providers: [ProvidedService, ExportedService],
  exports: [ExportedService],
})
class AModule {}

@module({
  imports: [AModule],
})
class AppModule {}

InversifySugar.run(AppModule);

// Accessing the container of a module
const appModuleContainer = getModuleContainer(AppModule);
const testModuleContainer = getModuleContainer(TestModule);

// Getting a service provided or imported
const providedService = testModuleContainer.get(ProvidedService);
const importedService = appModuleContainer.get(ImportedService);

// Getting a service locally provided to module
const providedService = testModuleContainer.getProvided(ProvidedService);

// Getting a service imported from a module to another
const importedService = appModuleContainer.getImported(ImportedService);
```

The container returned by the `getModuleContainer()` function is a wrapper of the Inversify's `Container` class that exposes only the necessary methods to access dependencies in both the providers section of the container and the container section of services imported by other modules.

#### ModuleContainer

```typescript
get innerContainer(): Container
```

```typescript
isBound(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean
```

```typescript
isProvided(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean
```

```typescript
isImported(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean
```

```typescript
bindProvider(provider: Provider): void
```

```typescript
copyBindings(container: ModuleContainer, serviceIdentifiers: interfaces.ServiceIndentifier[], constraint?: interfaces.ConstraintFunction): void
```

```typescript
get<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T
```

```typescript
getAll<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T
```

```typescript
getProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T
```

```typescript
getAllProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T[]
```

```typescript
getImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T | T[]
```

```typescript
getAllImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T[]
```

```typescript
unbindAll(): void
```

#### Dynamic Modules

It's time to talk more in depth about dynamic modules.

Unlike static modules, dynamic modules allow us to pass configuration when importing them to modify their behavior depending on the scenario.

A common way to use them is through the static methods `forRoot`, `forFeature`, `forChild` or `register` of a regular module.

```typescript
@injectable()
export class CatsService {
  constructor(@multiInject(CatNameToken) private readonly catNames: string[]) {}

  public showCats() {
    console.log(this.catNames.join(", "));
  }
}

const CatNameToken = Symbol.for("CatName");

@module({})
export class CatsModule {
  static forRoot(catNames: string[]): DynamicModule {
    return {
      module: CatsModule,
      providers: [
        CatsService,
        ...catNames.map((catName) => ({
          provide: CatNameToken,
          useValue: catName,
        })),
      ],
    };
  }
}

@module({
  imports: [CatsModule.forRoot(["Toulouse", "Tomas O'Malley", "Duchess"])],
})
export class AppModule {}
```

```typescript
catsService.showCats(); // Toulouse, Tomas O'Malley, Duchess
```

##### Combining Static and Dynamic Providers

When using dynamic modules in your application, you should be aware that providers specified in the `@module` decorator metadata will be combined with those you specify dynamically.

```typescript
@injectable()
export class CatsService {
  constructor(@multiInject(CatNameToken) private readonly catNames: string[]) {}

  public showCats() {
    console.log(this.catNames.join(", "));
  }
}

const CatNameToken = Symbol.for("CatName");

@module({
  providers: ["Toulouse", "Tomas O'Malley", "Duchess"],
})
export class CatsModule {
  static forRoot(catNames: string[]): DynamicModule {
    return {
      module: CatsModule,
      providers: [
        CatsService,
        ...catNames.map((catName) => ({
          provide: CatNameToken,
          useValue: catName,
        })),
      ],
    };
  }
}

@module({
  imports: [CatsModule.forRoot(["Félix"])],
})
export class AppModule {}
```

```typescript
catsService.showCats(); // Toulouse, Tomas O'Malley, Duchess, Félix
```

##### Read More About Dynamic Modules

This feature is highly inspired by the dynamic modules used by [Angular](https://v17.angular.io/guide/singleton-services#the-forroot-pattern) and [NestJS](https://docs.nestjs.com/fundamentals/dynamic-modules). Check their documentation if you want to compare their similarities.

### Injection

In the same way as we do in InversifyJS, to inject dependencies into a class we will use the `@inject` and `@multiInject` decorators over constructor parameters or class properties.

```typescript
// Constructor injection

import { inject, multiInject } from "inversify-sugar";
import { Logger } from "./Logger";
import { CatNameToken } from "./CatNameToken";

@injectable()
class CatsService {
  constructor(
    @inject(Logger) private readonly logger: Logger,
    @multiInject(CatNameToken) private readonly catNames: string[]
  ) {}
}
```

```typescript
// Property injection

import { inject, multiInject } from "inversify-sugar";
import { Logger } from "./Logger";
import { CatNameToken } from "./CatNameToken";

@injectable()
class CatsService {
  @inject(Logger) private readonly logger: Logger;
  @multiInject(CatNameToken) private readonly catNames: string[];
}
```

#### Local Provider Injection

We may only want to get the services provided locally in a module without those that have been imported from other modules with the same `ServiceIdentifier`.

Use the `@injectProvided` decorator when you want to inject a service into another that belongs to the same module (`CatsModule`).

In the same way, we can use the `@multiInjectProvided` decorator to obtain an array with all providers registered with that identifier.

In any case, it is almost never necessary to be so explicit about the origin of the services, so the recommendation is to use `@inject` and `@multiInject` by default.

```typescript
// cats/CatsService.ts

import { injectable } from "inversify-sugar";

@injectable()
export class CatsService {}
```

```typescript
// cats/constants.ts

export const CatNameToken = Symbol("CatName");
```

```typescript
// cats/CatsController.ts

import { injectable, provided, allProvided } from "inversify-sugar";
import { CatsService } from "./CatsService";
import { CatNameToken } from "./constants";

@injectable()
export class CatsController {
  constructor(
    @injectProvided(CatsService) public readonly catsService: CatsService,
    @multiInjectProvided(CatNameToken) public readonly catNames: string[]
  ) {}
}
```

```typescript
// cats/CatsModule.ts

import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";
import { CatNameToken } from "./CatNameToken";

@module({
  providers: [
    CatsService,
    CatsController,
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
})
export class CatsModule {}
```

#### Imported Provider Injection

Similarly, if at any time you need to obtain a service imported from another module leaving out the services provided locally in the module you can use `@injectImported` and `@multiInjectImported` decorators.

Again, use `@inject` and `@multiInject` as a first option before using more specific decorators.

```typescript
// cats/CatsService.ts

import { injectable } from "inversify-sugar";

@injectable()
export class CatsService {}
```

```typescript
// cats/CatsModule.ts

import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";
import { CatNameToken } from "./CatNameToken";

@module({
  providers: [
    CatsService,
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
  exported: [
    CatsService,
    {
      provide: CatNameToken,
    },
  ],
})
export class CatsModule {}
```

```typescript
// AppController.ts

import {
  injectable,
  injectImported,
  multiInjectImported,
} from "inversify-sugar";
import { CatsService } from "./cats/CatsService";
import { CatNameToken } from "./cats/CatNameToken";

@injectable()
export class AppController {
  constructor(
    @injectImported(CatsService) public readonly catsService: CatsService,
    @multiInjectImported(CatNameToken) public readonly catNames: string[]
  ) {}
}
```

```typescript
// AppModule.ts

import { module } from "inversify-sugar";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

## Testing

The complexity of the memory state during the execution of Inversify Sugar, managing multiple Inversify containers under the hood, is too high to ensure that it is working correctly without writing unit tests of each of the functionalities separately.

For this reason, a set of tests have been written that you can consult [here](./test).

So you can use it without worries. You are facing a completely armored dependency system.

<img src="./assets/badges/coverage/badge-functions.svg" />
<img src="./assets/badges/coverage/badge-lines.svg" />
<img src="./assets/badges/coverage/badge-statements.svg" />
<img src="./assets/badges/coverage/badge-branches.svg" />

## Support the Project

<p align="center">☕️ Buy me a coffee so the open source party will never end.</p>

<p align="center"><a href="https://www.buymeacoffee.com/carlossala95" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a></p>

<p align="center">
  <a href="https://www.youtube.com/channel/UCC-EUKPStBfQ1nEIvSl6bAQ" target="_blank">YouTube</a> |
  <a href="https://instagram.com/carlossalasamper" target="_blank">Instagram</a> |
  <a href="https://twitter.com/carlossala95" target="_blank">Twitter</a> |
  <a href="https://facebook.com/carlossala95" target="_blank">Facebook</a>
</p>
<p align="center">
  <a href="https://godofprogramming.com" target="_blank">godofprogramming.com</a>
</p>

## License

The Inversify Sugar source code is made available under the [MIT license](./LICENSE).

Some of the dependencies are licensed differently, with the BSD license, for example.
