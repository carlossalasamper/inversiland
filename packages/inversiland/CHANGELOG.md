# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0]

### Added

- Added `innerContainer` property to `ModuleContainer` to access the Inversify container directly.
- Added `@inject` decorator to use by default for injecting dependencies. It makes the library usage easier.
- Added `@multiInject` decorator to use by default for injecting arrays of dependencies. It makes the library usage easier.
- Added `@multiInjectImported` decorator to make the API symmetrical.
- Added `get(serviceIdentifier: interfaces.ServiceIdentifier)` method to `ModuleContainer` to get a provider.
- Added `getAll(serviceIdentifier: interfaces.ServiceIdentifier)` method to `ModuleContainer` to get all providers.
- Added `isBound(serviceIdentifier: interfaces.ServiceIdentifier)` method to `ModuleContainer` to check if a provider is bound.
- Added `copyBindings` method to `ModuleContainer` to copy a subset of bindings from another container, filtering by metadata and applying a new constraint. This method is used to import dependencies from a container to another without having to merge all the bindings.
- Added `ExistingProvider` provider type to create an alias of a bound service in a module.

### Changed

- The `@provided` decorator is renamed to `@injectProvided`, since it is more meaningful.
- The `@allProvided` decorator is renamed to `@multiInjectProvided`, since it is more meaningful.
- The `@imported` decorator is renamed to `@injectImported` since it is more meaningful.
- `@imported` decorator will throw an exception when more than one provider is imported for the same `ServiceIdentifier`. You have to use `@multiInjectImported` from now the same way you do with local providers of a module.
- Renames `logMiddleware` to `debugMiddleware`.
- Improved debug logs to show container ID.

### Fixed

- Providers `provide` property allows a `ServiceIdentifier` rather than the current limited type `string  | Symbol`.
- Applying `debugMiddleware` to every module container. It was only being applied to the `InversifySugar.globalContainer`. Now you can debug resolutions in any module when `InversifySugar.options.debug = true`.

## [0.5.9]

### Added

- Initial release.
