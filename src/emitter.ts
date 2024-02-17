import type { Unsubscribable } from "./subscription";
import { Subscription } from "./subscription";

type AnyKey = string | number | symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultEventTypes = { [K in AnyKey]: any };

export type Handler<T> = (value: T) => void;

export type Subscribable<T> = (handler: Handler<T>) => Unsubscribable;

type HandlerSets<EventTypes extends object> = {
  [K in keyof EventTypes]?: Set<Handler<EventTypes[K]>>;
};

type ValueOmittableKeyOf<EventTypes extends object> = {
  [K in keyof EventTypes]: undefined extends EventTypes[K] ? K : never;
}[keyof EventTypes];

type Value<EventTypes extends object, K extends keyof EventTypes> =
  (K extends unknown ? (x: EventTypes[K]) => unknown : never) extends (x: infer I) => unknown ? I
  : never;

export class Emitter<EventTypes extends object = DefaultEventTypes> {
  private handlerSets: HandlerSets<EventTypes>;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.handlerSets = Object.create(null);
  }

  /**
   * Attaches a handler function to a key.
   * @param key A key string.
   * @returns A function that takes a handler function and returns a subscription.
   */
  on<K extends keyof EventTypes>(key: K): Subscribable<EventTypes[K]>;

  /**
   * Attaches a handler function to a key.
   * @param key A key string.
   * @param handler A handler function which is invoked when an event is emitted.
   * @returns A subscription object which removes the handler function when unsubscribed.
   */
  on<K extends keyof EventTypes>(key: K, handler: Handler<EventTypes[K]>): Unsubscribable;

  on<K extends keyof EventTypes>(
    key: K,
    handler?: Handler<EventTypes[K]>,
  ): Subscribable<EventTypes[K]> | Unsubscribable {
    if (handler) {
      let handlerSet: Set<Handler<EventTypes[K]>> | undefined = this.handlerSets[key];
      if (!handlerSet) {
        handlerSet = new Set();
        this.handlerSets[key] = handlerSet;
      }
      handlerSet.add(handler);
      return new Subscription(() => {
        this.off(key, handler);
      });
    } else {
      return (handler) => this.on(key, handler);
    }
  }

  /**
   * Removes a handler function from a key.
   * @param key A key string.
   * @param handler A handler function.
   */
  off<K extends keyof EventTypes>(key: K, handler: Handler<EventTypes[K]>): void {
    const handlerSet: Set<Handler<EventTypes[K]>> | undefined = this.handlerSets[key];
    if (!handlerSet) {
      return;
    }
    handlerSet.delete(handler);
  }

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emitSync<K extends ValueOmittableKeyOf<EventTypes>>(key: K, value?: Value<EventTypes, K>): void;

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emitSync<K extends keyof EventTypes>(key: K, value: Value<EventTypes, K>): void;

  emitSync<K extends keyof EventTypes>(key: K, value: Value<EventTypes, K>): void {
    const handlerSet: Set<Handler<EventTypes[K]>> | undefined = this.handlerSets[key];
    if (!handlerSet) {
      return;
    }
    const copyHandlerSet = new Set(handlerSet);
    for (const handler of copyHandlerSet) {
      // eslint-disable-next-line @susisu/safe-typescript/no-type-assertion
      handler(value as EventTypes[K]);
    }
  }

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emit<K extends ValueOmittableKeyOf<EventTypes>>(
    key: K,
    value?: Value<EventTypes, K>,
  ): Promise<void>;

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emit<K extends keyof EventTypes>(key: K, value: Value<EventTypes, K>): Promise<void>;

  async emit<K extends keyof EventTypes>(key: K, value: Value<EventTypes, K>): Promise<void> {
    const handlerSet: Set<Handler<EventTypes[K]>> | undefined = this.handlerSets[key];
    if (!handlerSet) {
      return;
    }
    const promises = [...handlerSet].map((handler) =>
      Promise.resolve().then(() => {
        // eslint-disable-next-line @susisu/safe-typescript/no-type-assertion
        handler(value as EventTypes[K]);
      }),
    );
    await Promise.all(promises);
  }
}
