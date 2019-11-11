## 0.2.0 (yyyy-mm-dd)
### Breaking changes
- `Emitter#emit()` and `#emitAsync()` are renamed to `#emitSync()` and `#emit()`
- Rename `Disposable` to `Subscription` and `#dispose()` to `#unsubscribe()` etc.
- Rename `Listener` to `Handler`

### Features
- The second argument of `Emitter#emit()` and `#emitSync()` (previously `#emitAsync()` and `#emit()`) are now optional if its type is `undefined`

## 0.1.0 (2019-10-28)
- First release
