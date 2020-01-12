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

You can optionally restrict event types by giving a type argument to `Emitter`.

``` typescript
type EventTypes = {
  "change": number,
  "destroy": void,
};

const emitter = new Emitter<EventTypes>();

emitter.emit("change", 42);     // ok
emitter.emit("foo", 42);        // type error: unknown event
emitter.emit("change", "test"); // type error: mismatched value type
```

## Difference from other event emitters
By design, tyde has some difference from other event emitter libraries:

- No wildcards, because of the strongly typed interface.
- Events are emitted asynchronously by default.
  - Usually event handlers should not care whether it is called synchronously or asynchronously.
  - There is also a synchronous version `.emitSync()`, but it is not always recommended.
- Invocation order of event handlers is not guaranteed in any way.
  - Specifying execution order in a less explicit way will lower the readability of code.
  - If you still want one, invoke multiple functions in one event handler, or separate the event into multiple stages.

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
