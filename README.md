<a href="https://www.npmjs.com/package/inversiland" target="_blank"><img src="https://img.shields.io/npm/v/inversiland.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/inversiland" target="_blank"><img src="https://img.shields.io/npm/l/inversiland.svg" alt="Package License" /></a>

# Inversiland

<p align="center">
  <img alt="Inversiland banner" src="./assets/images/inversiland-cover.webp" style="max-width: 1280px; width: 100%;" />
</p>
<p align="center" style="margin-top: 10px;"> 🎡 <a href="https://inversify.io/">InversifyJS</a> framework to manage dependencies elegantly.</p>

## Table of Contents

- [Introduction](#introduction)
- [Why Inversiland](#why-inversiland)
- [Documentation](#documentation)
- [Templates](#templates)
- [Support the Project](#support-the-project)
- [License](#license)

## Introduction

In 2015, **Remo H. Jansen** gave birth to [InversifyJS](https://inversify.io/).

<p align="center">
  <img alt="Inversiland banner" src="./assets/images/inversify-founding-father.webp" style="max-width: 800px; width: 100%;" />
</p>

<p align="center"><q>A powerful and lightweight inversion of control (IoC) container for JavaScript & Node.js apps powered by TypeScript.</q></p>

Today, **we thank our founding father for his work**, but we're not going to ask for permission to create the ultimate JavaScript dependency system on par with Angular's or NestJS's injectors [from a fork of Inversify](./packages/inversify/README.md).

🎡 Welcome to Inversiland, the dependency system you've always dreamed of.

## Why Inversiland

Let's compare the most popular JavaScript dependency systems.

### Angular

Angular's injector allows us to relate the dependencies of one module to those of another through its import/export API.

```typescript
// (Angular) common.module.ts

import { NgModule } from "@angular/core";
import { Logger } from "./logger";

@NgModule({
  declarations: [Logger],
  exports: [Logger],
})
export class CommonModule {}
```

```typescript
// (Angular) cats.module.ts

import { NgModule } from "@angular/core";
import { CommonModule } from "./common.module";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@NgModule({
  imports: [CommonModule],
  declarations: [CatsController, CatsService],
})
export class CatsModule {}
```

```typescript
// (Angular) app.module.ts

import { NgModule } from "@angular/core";
import { CatsModule } from "./cats/cats.module";

@NgModule({
  imports: [CatsModule],
})
export class AppModule {}
```

### NestJS

The NestJS injector also features an import/export API between modules to share dependencies.

```typescript
// (NestJS) common.module.ts

import { Module } from "@nestjs/common";
import { Logger } from "./logger";

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class CommonModule {}
```

```typescript
// (NestJS) cats.module.ts

import { Module } from "@nestjs/common";
import { CommonModule } from "./common.module";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
  imports: [CommonModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

```typescript
// (NestJS) app.module.ts

import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### InversifyJS

Compared to modern dependency system APIs, Inversify has a number of disadvantages:

- ❌ Your have to create all the containers separately to scope the dependencies into modules (to build a hierarchical dependency system).
- ❌ How do you plan to relate dependencies between containers without an import/export API?
- ❌ There is no single entry point to initialize all the containers. They are initialized at the time the files that declare them are imported.

```typescript
// (Inversify) globalContainer.ts

const globalContainer = new Container();

// Global bindings here

export globalContainer
```

```typescript
// (Inversify) commonContainer.ts

import { globalContainer } from "./globalContainer";
import { Logger } from "./Logger";

const commonContainer = globalContainer.createChild();

commonContainer.bind(Logger).toSelf().inSingletonScope();

export commonContainer;
```

```typescript
// (Inversify) catsContainer.ts

import { globalContainer } from "./globalContainer";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

const catsContainer = globalContainer.createChild();

// 😿 We can't import a subset of bindings from commonContainer

catsContainer.bind(CatsController).toSelf().inSingletonScope();
catsContainer.bind(CatsService).toSelf().inSingletonScope();

export catsContainer;
```

### Inversiland

**Inversiland** is a framework built on top of Inversify with a clear objective: to offer an API on par with the most cutting-edge hierarchical dependency systems.

```typescript
// (Inversiland) CommonModule.ts

import { module } from "inversiland";
import { Logger } from "./Logger";

@module({
  providers: [Logger],
  exports: [Logger],
})
export class CommonModule {}
```

```typescript
// (Inversiland) CatsModule.ts

import { module } from "inversiland";
import { CommonModule } from "./CommonModule";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  imports: [CommonModule],
  providers: [CatsService, CatsController],
})
export class CatsModule {}
```

```typescript
// (Inversiland) AppModule.ts

import { module } from "inversiland";
import { CatsModule } from "./CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

Follow [the official guide to start using Inversiland](./documentation/GettingStarted.md).

## Documentation

- [Getting Started](./documentation/GettingStarted.md)
- [Modules](./documentation/Modules.md)
- [Injection](./documentation/Injection.md)
- [Dynamic Modules](./documentation/DynamicModules.md)

## Templates

Don't start your projects from scratch, choose a well-configured template.

- [react-clean-architecture](https://github.com/carlossalasamper/react-clean-architecture)

## Support the Project

To keep this open source project alive, community support is needed.

- ⭐ Star the repository and share it with your coworkers.
- 💲 Become a sponsor so we will invest more time improving the product.

### Become a Sponsor

<p><a href="https://www.buymeacoffee.com/carlossala95" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a></p>

### Sponsors

<p>
  Become a sponsor of Inversiland through any platform to appear in this section.
</p>

## License

The Inversiland source code is made available under the [MIT license](./LICENSE).

Some of the dependencies are licensed differently, with the BSD license, for example.
