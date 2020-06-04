import { Unsubscribable, Subscription } from "./subscription";

type ElimUnion<T> = ElimUnionSub<T, T>;
type ElimUnionSub<T0, T1> = T0 extends T1 ? [T1] extends [T0] ? T0 : never : never;

type AnyKey = string | number | symbol;

type SingletonKey<K extends AnyKey> =
    string extends K ? never
  : number extends K ? never
  : symbol extends K ? never
  : ElimUnion<K>;

export type Handler<T> = (value: T) => void;
export type Subscribable<T> = (handler: Handler<T>) => Unsubscribable;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultEventTypes = { [K in AnyKey]: any };

type HandlerSets<EventTypes extends object> = {
  [K in keyof EventTypes]?: Set<Handler<EventTypes[K]>>
};

type ValueOmittableKeyOf<EventTypes extends object> = {
  [K in keyof EventTypes]: undefined extends EventTypes[K] ? K : never
}[keyof EventTypes];

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
  on<K extends keyof EventTypes>(
    key: SingletonKey<K>,
  ): Subscribable<EventTypes[SingletonKey<K>]>;

  /**
   * Attaches a handler function to a key.
   * @param key A key string.
   * @param handler A handler function which is invoked when an event is emitted.
   * @returns A subscription object which removes the handler function when unsubscribed.
   */
  on<K extends keyof EventTypes>(
    key: SingletonKey<K>, handler: Handler<EventTypes[SingletonKey<K>]>,
  ): Unsubscribable;

  on<K extends keyof EventTypes>(
    key: SingletonKey<K>, handler?: Handler<EventTypes[SingletonKey<K>]>,
  ): Subscribable<EventTypes[SingletonKey<K>]> | Unsubscribable {
    if (handler) {
      let handlerSet: Set<Handler<EventTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
      if (!handlerSet) {
        handlerSet = new Set();
        this.handlerSets[key] = handlerSet;
      }
      handlerSet.add(handler);
      return new Subscription(() => {
        this.off(key, handler);
      });
    } else {
      return handler => this.on(key, handler);
    }
  }

  /**
   * Removes a handler function from a key.
   * @param key A key string.
   * @param handler A handler function.
   */
  off<K extends keyof EventTypes>(
    key: SingletonKey<K>, handler: Handler<EventTypes[SingletonKey<K>]>,
  ): void {
    const handlerSet: Set<Handler<EventTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
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
  emitSync<K extends ValueOmittableKeyOf<EventTypes>>(
    key: SingletonKey<K>, value?: EventTypes[SingletonKey<K>],
  ): void;

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emitSync<K extends keyof EventTypes>(
    key: SingletonKey<K>, value: EventTypes[SingletonKey<K>],
  ): void;

  emitSync<K extends keyof EventTypes>(
    key: SingletonKey<K>, value: EventTypes[SingletonKey<K>],
  ): void {
    const handlerSet: Set<Handler<EventTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
    if (!handlerSet) {
      return;
    }
    const copyHandlerSet = new Set(handlerSet);
    for (const handler of copyHandlerSet) {
      handler(value);
    }
  }

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emit<K extends ValueOmittableKeyOf<EventTypes>>(
    key: SingletonKey<K>, value?: EventTypes[SingletonKey<K>],
  ): Promise<void>;

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emit<K extends keyof EventTypes>(
    key: SingletonKey<K>, value: EventTypes[SingletonKey<K>],
  ): Promise<void>;

  async emit<K extends keyof EventTypes>(
    key: SingletonKey<K>, value: EventTypes[SingletonKey<K>],
  ): Promise<void> {
    const handlerSet: Set<Handler<EventTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
    if (!handlerSet) {
      return;
    }
    const promises = [...handlerSet].map(handler =>
      Promise.resolve().then(() => {
        handler(value);
      }),
    );
    await Promise.all(promises);
  }
}
