# @susisu/tyde

[![CI](https://github.com/susisu/tyde/workflows/CI/badge.svg)](https://github.com/susisu/tyde/actions?query=workflow%3ACI)

Typed event emitter

## Installation

``` shell
# npm
npm i @susisu/tyde
# yarn
yarn add @susisu/tyde
# pnpm
pnpm add @susisu/tyde
```

## Usage

tyde provides API that is similar to [EventEmitter](https://nodejs.org/api/events.html) and [event-kit](https://github.com/atom/event-kit).

The simplest usage is subscribing events with `.on()` and emitting events with `.emit()`.

``` typescript
import { Emitter } from "@susisu/tyde";

const emitter = new Emitter();

const subscription = emitter.on("change", value => {
  console.log(value);
});

emitter.emit("change", 42); // -> 42
```

Subscriptions can be unsubscribed by calling `.unsubscribe()`.

``` typescript
subscription.unsubscribe();
emitter.emit("change", 0); // no output
```

The curried version of `.on()` is also available.

``` typescript
const onChange = emitter.on("change");
const subscription = onChange(value => { /* ... */ });
```

You can optionally restrict types of emitted values by giving a dictionary to `Emitter`'s type parameter.

``` typescript
const emitter = new Emitter<{
  "change": number,
  "destroy": void,
}>();

emitter.emit("change", 42);     // ok
emitter.emit("destroy");        // ok
emitter.emit("foo", 42);        // type error: unknown event
emitter.emit("change", "test"); // type error: mismatched type
```

## Difference from other event emitters

By design, tyde has some difference from other event emitter libraries:

- No wildcards, because of the strongly typed interface.
- Events are emitted asynchronously by default.
  - Usually event handlers should not care whether it is called synchronously or asynchronously.
  - There is also a synchronous version `.emitSync()`, but it is not generally recommended.
- Invocation order of event handlers is not guaranteed in any way.
  - Specifying execution order in a less explicit way will lower the readability of code.
  - If you still want one, invoke functions sequentially in one event handler, or separate the event into multiple stages.

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
