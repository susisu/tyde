import { Unsubscribable, Subscription } from "./subscription";

type ElimUnion<T> = ElimUnionSub<T, T>;
type ElimUnionSub<T0, T1> = T0 extends T1 ? [T1] extends [T0] ? T0 : never : never;

type SingletonKey<K extends string> =
  string extends K ? never : ElimUnion<K>;

type IsUndefined<T, A, B> = [T] extends [undefined] ? undefined extends T ? A : B : B;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultValueTypes<Keys extends string> = { [K in Keys]: any };

export type Listener<T> = (value: T) => void;
export type Listen<T> = (listener: Listener<T>) => Unsubscribable;

type ListenerSets<Keys extends string, ValueTypes extends DefaultValueTypes<Keys>> =
  { [K in Keys]?: Set<Listener<ValueTypes[K]>> };

export class Emitter<
  Keys extends string = string,
  ValueTypes extends DefaultValueTypes<Keys> = DefaultValueTypes<Keys>,
> {
  private listenerSets: ListenerSets<Keys, ValueTypes>;

  constructor() {
    this.listenerSets = Object.create(null);
  }

  /**
   * Attaches a listener function to a key.
   * @param key A key string.
   * @returns A function that takes a listener function and returns a subscription.
   */
  on<K extends Keys>(
    key: SingletonKey<K>,
  ): Listen<ValueTypes[SingletonKey<K>]>;

  /**
   * Attaches a listener function to a key.
   * @param key A key string.
   * @param listener A listener function which is invoked when an event is emitted.
   * @returns A subscription object which removes the listener function when unsubscribed.
   */
  on<K extends Keys>(
    key: SingletonKey<K>, listener: Listener<ValueTypes[SingletonKey<K>]>,
  ): Unsubscribable;

  on<K extends Keys>(
    key: SingletonKey<K>, listener?: Listener<ValueTypes[SingletonKey<K>]>,
  ): Listen<ValueTypes[SingletonKey<K>]> | Unsubscribable {
    if (listener) {
      let listenerSet: Set<Listener<ValueTypes[SingletonKey<K>]>> | undefined =
        this.listenerSets[key];
      if (!listenerSet) {
        listenerSet = new Set();
        this.listenerSets[key] = listenerSet;
      }
      listenerSet.add(listener);
      return new Subscription(() => {
        this.off(key, listener);
      });
    } else {
      return listener => this.on(key, listener);
    }
  }

  /**
   * Removes a listener function from a key.
   * @param key A key string.
   * @param listener A listener function.
   */
  off<K extends Keys>(
    key: SingletonKey<K>, listener: Listener<ValueTypes[SingletonKey<K>]>,
  ): void {
    const listenerSet: Set<Listener<ValueTypes[SingletonKey<K>]>> | undefined =
      this.listenerSets[key];
    if (!listenerSet) {
      return;
    }
    listenerSet.delete(listener);
  }

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  emitSync<K extends Keys>(
    key: IsUndefined<ValueTypes[SingletonKey<K>], SingletonKey<K>, never>,
    value?: undefined,
  ): void;

  /**
   * Emits an event synchronously.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  emitSync<K extends Keys>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): void;

  emitSync<K extends Keys>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): void {
    const listenerSet: Set<Listener<ValueTypes[SingletonKey<K>]>> | undefined =
      this.listenerSets[key];
    if (!listenerSet) {
      return;
    }
    const copySet = new Set(listenerSet);
    for (const listener of copySet) {
      listener(value);
    }
  }

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  emit<K extends Keys>(
    key: IsUndefined<ValueTypes[SingletonKey<K>], SingletonKey<K>, never>,
    value?: undefined,
  ): Promise<void>;

  /**
   * Emits an event asynchronously.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  emit<K extends Keys>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): Promise<void>;

  async emit<K extends Keys>(
    key: SingletonKey<K>, value: ValueTypes[SingletonKey<K>],
  ): Promise<void> {
    const listenerSet: Set<Listener<ValueTypes[SingletonKey<K>]>> | undefined =
      this.listenerSets[key];
    if (!listenerSet) {
      return;
    }
    const promises = [...listenerSet].map(listener =>
      Promise.resolve().then(() => {
        listener(value);
      }),
    );
    await Promise.all(promises);
  }
}
