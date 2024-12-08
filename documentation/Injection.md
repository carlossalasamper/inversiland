# Injection

## Table of Contents

- [Introduction](#introduction)
- [Local Provider Injection](#local-provider-injection)
- [Imported Provider Injection](#imported-provider-injection)

## Introduction

In the same way as we do in InversifyJS, to inject dependencies into a class we will use the `@inject` and `@multiInject` decorators over constructor parameters or class properties.

```typescript
// Constructor injection

import { inject, multiInject } from "inversiland";
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

import { inject, multiInject } from "inversiland";
import { Logger } from "./Logger";
import { CatNameToken } from "./CatNameToken";

@injectable()
class CatsService {
  @inject(Logger) private readonly logger: Logger;
  @multiInject(CatNameToken) private readonly catNames: string[];
}
```

## Local Provider Injection

We may only want to get the services provided locally in a module without those that have been imported from other modules with the same `ServiceIdentifier`.

Use the `@injectProvided` decorator when you want to inject a service into another that belongs to the same module (`CatsModule`).

In the same way, we can use the `@multiInjectProvided` decorator to obtain an array with all providers registered with that identifier.

In any case, it is almost never necessary to be so explicit about the origin of the services, so the recommendation is to use `@inject` and `@multiInject` by default.

```typescript
// cats/CatsService.ts

import { injectable } from "inversiland";

@injectable()
export class CatsService {}
```

```typescript
// cats/constants.ts

export const CatNameToken = Symbol("CatName");
```

```typescript
// cats/CatsController.ts

import { injectable, provided, allProvided } from "inversiland";
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

import { module } from "inversiland";
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

## Imported Provider Injection

Similarly, if at any time you need to obtain a service imported from another module leaving out the services provided locally in the module you can use `@injectImported` and `@multiInjectImported` decorators.

Again, use `@inject` and `@multiInject` as a first option before using more specific decorators.

```typescript
// cats/CatsService.ts

import { injectable } from "inversiland";

@injectable()
export class CatsService {}
```

```typescript
// cats/CatsModule.ts

import { module } from "inversiland";
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

import { injectable, injectImported, multiInjectImported } from "inversiland";
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

import { module } from "inversiland";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```
