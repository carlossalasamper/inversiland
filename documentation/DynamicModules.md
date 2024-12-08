# Dynamic Modules

## Table of Contents

- [Introduction](#introduction)
- [Combining Static and Dynamic Providers](#combining-static-and-dynamic-providers)
- [Read More about Dynamic Modules](#read-more-about-dynamic-modules)

## Introduction

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

## Combining Static and Dynamic Providers

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

## Read More about Dynamic Modules

This feature is highly inspired by the dynamic modules used by [Angular](https://v17.angular.io/guide/singleton-services#the-forroot-pattern) and [NestJS](https://docs.nestjs.com/fundamentals/dynamic-modules). Check their documentation if you want to compare their similarities.
