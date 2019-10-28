import { IDisposable, Disposable } from "./disposable";

type ElimUnion<T> = ElimUnionSub<T, T>;
type ElimUnionSub<T0, T1> = T0 extends T1 ? [T1] extends [T0] ? T0 : never : never;

type SingletonKey<K extends string> =
  string extends K ? never : ElimUnion<K>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultValueTypes<Keys extends string> = { [K in Keys]: any };

type Listener<T> = (value: T) => void;
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
   * @param listener A listener function which is invoked when an event is emitted.
   * @returns A disposable object which removes the listener function when disposed.
   */
  on<K extends Keys>(
    key: SingletonKey<K>, listener: Listener<ValueTypes[SingletonKey<K>]>,
  ): IDisposable {
    let listenerSet: Set<Listener<ValueTypes[SingletonKey<K>]>> | undefined =
      this.listenerSets[key];
    if (!listenerSet) {
      listenerSet = new Set();
      this.listenerSets[key] = listenerSet;
    }
    listenerSet.add(listener);
    return new Disposable(() => {
      this.off(key, listener);
    });
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
   * Emits an event.
   * An event is a pair of a key string and a value.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  emit<K extends Keys>(
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
   * This method is similar to `emit()`, but listener functions are invoked asynchronously.
   * @param key A key string.
   * @param value A value passed to listeners.
   */
  async emitAsync<K extends Keys>(
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
