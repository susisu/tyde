# @susisu/tyde
A library for implementing simple event subscription APIs.

## Installation
``` shell
npm i @susisu/tyde
# or
yarn add @susisu/tyde
```

## Usage
tyde provides APIs similar to [EventEmitter](https://nodejs.org/api/events.html) and [event-kit](https://github.com/atom/event-kit).

The simplest usage is subscribing an event with `.on()` and emitting events with `.emit()`.

``` typescript
import { Emitter } from "@susisu/tyde";

const emitter = new Emitter();

const subscription = emitter.on("change", value => {
  console.log(value);
});

emitter.emit("change", 42); // -> 42
```

Subscription can be unsubscribed by calling `.unsubscribe()`.

``` typescript
subscription.unsubscribe();
emitter.emit("change", 0); // no output
```

A curried version of `.on()` is also available.

``` typescript
const onChange = emitter.on("change");
const subscription = onChange(value => { /* ... */ });
```

You can optionally pass type arguments to `Emitter` constructor to report some kind of errors.

The first argument is a union type of event keys, which restricts the types of events to be emitted.

``` typescript
type Keys = "change" | "destroy";

const emitter = new Emitter<Keys>();

emitter.emit("change", 42); // ok
emitter.emit("foo", 42);    // type error: unknown key
```

The second argument is a map from event keys to value types, which restricts the type of emitted value for each key.

``` typescript
type Keys = "change" | "destroy";
type ValueTypes = {
  "change": number,
  "destroy": undefined,
};

const emitter = new Emitter<Keys, ValueTypes>();

emitter.emit("change", 42);    // ok
emitter.emit("change", "foo"); // type error: mismatched value type
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
