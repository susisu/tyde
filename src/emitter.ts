import { Unsubscribable, Subscription } from "./subscription";

type ElimUnion<T> = ElimUnionSub<T, T>;
type ElimUnionSub<T0, T1> = T0 extends T1 ? [T1] extends [T0] ? T0 : never : never;

type SingletonKey<K extends string> = string extends K ? never : ElimUnion<K>;

type IsUndefined<T, A, B> = [T] extends [undefined] ? undefined extends T ? A : B : B;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultValueTypes<Key extends string> = { [K in Key]: any };

export type Handler<T> = (value: T) => void;
export type Subscribable<T> = (handler: Handler<T>) => Unsubscribable;

type HandlerSets<Key extends string, ValueTypes extends DefaultValueTypes<Key>> =
  { [K in Key]?: Set<Handler<ValueTypes[K]>> };

export class Emitter<
  Key extends string = string,
  ValueTypes extends DefaultValueTypes<Key> = DefaultValueTypes<Key>,
> {
  private handlerSets: HandlerSets<Key, ValueTypes>;

  constructor() {
    this.handlerSets = Object.create(null);
  }

  /**
   * Attaches a handler function to a key.
   * @param key A key string.
   * @returns A function that takes a handler function and returns a subscription.
   */
  on<K extends Key>(
    key: SingletonKey<K>,
  ): Subscribable<ValueTypes[SingletonKey<K>]>;

  /**
   * Attaches a handler function to a key.
   * @param key A key string.
   * @param handler A handler function which is invoked when an event is emitted.
   * @returns A subscription object which removes the handler function when unsubscribed.
   */
  on<K extends Key>(
    key: SingletonKey<K>, handler: Handler<ValueTypes[SingletonKey<K>]>,
  ): Unsubscribable;

  on<K extends Key>(
    key: SingletonKey<K>, handler?: Handler<ValueTypes[SingletonKey<K>]>,
  ): Subscribable<ValueTypes[SingletonKey<K>]> | Unsubscribable {
    if (handler) {
      let handlerSet: Set<Handler<ValueTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
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
  off<K extends Key>(
    key: SingletonKey<K>, handler: Handler<ValueTypes[SingletonKey<K>]>,
  ): void {
    const handlerSet: Set<Handler<ValueTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
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
  emitSync<K extends Key>(
    key: IsUndefined<ValueTypes[SingletonKey<K>], SingletonKey<K>, never>,
    value?: undefined,
  ): void;

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emitSync<K extends Key>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): void;

  emitSync<K extends Key>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): void {
    const handlerSet: Set<Handler<ValueTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
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
  emit<K extends Key>(
    key: IsUndefined<ValueTypes[SingletonKey<K>], SingletonKey<K>, never>,
    value?: undefined,
  ): Promise<void>;

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to handlers.
   */
  emit<K extends Key>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): Promise<void>;

  async emit<K extends Key>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): Promise<void> {
    const handlerSet: Set<Handler<ValueTypes[SingletonKey<K>]>> | undefined = this.handlerSets[key];
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
