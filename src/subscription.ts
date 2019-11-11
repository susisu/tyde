export interface Unsubscribable {
  /**
   * Unsubscribes this subscription.
   */
  unsubscribe(): void;
}

export class Subscription implements Unsubscribable {
  private unsubscribed: boolean;
  private onUnsubscribe: (() => void) | undefined;

  /**
   * @param onUnsubscribe A callback function invoked when this subscription is unsubscribed.
   */
  constructor(onUnsubscribe: () => void) {
    this.unsubscribed = false;
    this.onUnsubscribe = onUnsubscribe;
  }

  /**
   * Unsubscribes this subscription i.e. invokes `onUnsubscribe` callback function.
   */
  unsubscribe(): void {
    if (this.unsubscribed || typeof this.onUnsubscribe !== "function") {
      return;
    }
    this.unsubscribed = true;
    this.onUnsubscribe.call(undefined);
    this.onUnsubscribe = undefined;
  }
}

export class CompositeSubscription implements Unsubscribable {
  private unsubscribed: boolean;
  private subscriptions: Set<Unsubscribable>;

  constructor() {
    this.unsubscribed = false;
    this.subscriptions = new Set();
  }

  /**
   * Adds a subscription to the set of subscriptions which are unsubscribed at a time when this
   * object is unsubscribed.
   * @param subscription A subscription object.
   */
  add(subscription: Unsubscribable): void{
    if (this.unsubscribed) {
      return;
    }
    this.subscriptions.add(subscription);
  }

  /**
   * Removes a subscription from the set of subscriptions.
   * @param subscription A subscription object.
   */
  remove(subscription: Unsubscribable): void {
    if (this.unsubscribed) {
      return;
    }
    this.subscriptions.delete(subscription);
  }

  /**
   * Clears the set of subscriptions.
   */
  clear(): void {
    if (this.unsubscribed) {
      return;
    }
    this.subscriptions.clear();
  }

  /**
   * Unsubscribes all the subscriptions in the set.
   */
  unsubscribe(): void {
    if (this.unsubscribed) {
      return;
    }
    this.unsubscribed = true;
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}
