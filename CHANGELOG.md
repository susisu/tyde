## 0.3.6 (2022-05-28)
- Include source files in the distribution

## 0.3.5 (2021-12-02)
- Upgrade devDependencies

## 0.3.4 (2020-11-03)
- Fix events marked as `never` could still be emitted if union `key` is given

## 0.3.3 (2020-11-03)
- Fix events marked as `never` could be emitted

## 0.3.2 (2020-11-02)
- Improve typings
  - Now `Emitter` can take union `key`s like `"foo" | "bar"`.

## 0.3.1 (2020-06-04)
- Improve types of `emit` / `emitSync`
  - This change made `Emitter<T>` covariant wrt `T`.

## 0.3.0 (2020-01-12)
### Breaking changes
- `Emitter` now takes only one type argument `EventTypes`, which maps event keys to types of emitted values.
  - This was the second type argument in the previous version.

## 0.2.2 (2019-11-16)
### Features
- Allow more types (e.g. `number | undefined`) to be omitted from `#emit()` and `#emitSync()`

## 0.2.1 (2019-11-16)
### Features
- Allow omitting emitted value when value type is `void`

## 0.2.0 (2019-11-11)
### Breaking changes
- Rename APIs
  - `Emitter#emit()` and `#emitAsync()` are renamed to `#emitSync()` and `#emit()`
  - Rename `Disposable` to `Subscription` and `#dispose()` to `#unsubscribe()` etc.
  - Rename `Listener` to `Handler`

### Features
- The second argument of `Emitter#emit()` and `#emitSync()` (previously `#emitAsync()` and `#emit()`) are now optional if its type is `undefined`

## 0.1.0 (2019-10-28)
- First release
