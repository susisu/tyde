export interface Unsubscribable {
  /**
   * Unsubscribes this subscription.
   */
  unsubscribe(): void;
}

export class Subscription implements Unsubscribable {
  private done: boolean;
  private onUnsubscribe: (() => void) | undefined;

  /**
   * @param onUnsubscribe A callback function invoked when this subscription is unsubscribed.
   */
  constructor(onUnsubscribe: () => void) {
    this.done = false;
    this.onUnsubscribe = onUnsubscribe;
  }

  /**
   * Unsubscribes this subscription i.e. invokes `onUnsubscribe` callback function.
   */
  unsubscribe(): void {
    if (this.done || typeof this.onUnsubscribe !== "function") {
      return;
    }
    this.done = true;
    this.onUnsubscribe.call(undefined);
    this.onUnsubscribe = undefined;
  }
}

export class CompositeSubscription implements Unsubscribable {
  private done: boolean;
  private subscriptions: Set<Unsubscribable>;

  constructor() {
    this.done = false;
    this.subscriptions = new Set();
  }

  /**
   * Adds a subscription to the set of subscriptions which are unsubscribed at a time when this
   * object is unsubscribed.
   * @param subscription A subscription object.
   */
  add(subscription: Unsubscribable): void{
    if (this.done) {
      return;
    }
    this.subscriptions.add(subscription);
  }

  /**
   * Removes a subscription from the set of subscriptions.
   * @param subscription A subscription object.
   */
  remove(subscription: Unsubscribable): void {
    if (this.done) {
      return;
    }
    this.subscriptions.delete(subscription);
  }

  /**
   * Clears the set of subscriptions.
   */
  clear(): void {
    if (this.done) {
      return;
    }
    this.subscriptions.clear();
  }

  /**
   * Unsubscribes all the subscriptions in the set.
   */
  unsubscribe(): void {
    if (this.done) {
      return;
    }
    this.done = true;
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}
