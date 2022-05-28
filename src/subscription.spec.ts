import { Subscription, CompositeSubscription } from "./subscription";

describe("Subscription", () => {
  describe("#unsubscribe", () => {
    it("should call the function which is attached at the creation", () => {
      const callback = jest.fn();
      const subscription = new Subscription(callback);

      expect(callback).not.toHaveBeenCalled();

      subscription.unsubscribe();
      expect(callback).toHaveBeenCalledTimes(1);

      // ubsubscribing twice or more has no effect
      subscription.unsubscribe();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});

describe("CompositeSubscription", () => {
  describe("#add", () => {
    it("should add a subscription to the set of subscriptions", () => {
      const callback = jest.fn();
      const subscription = new Subscription(callback);

      const composite = new CompositeSubscription();
      composite.add(subscription);

      expect(callback).not.toHaveBeenCalled();

      composite.unsubscribe();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("#remove", () => {
    it("should remove a subscription from the set", () => {
      const callback = jest.fn();
      const subscription = new Subscription(callback);

      const composite = new CompositeSubscription();
      composite.add(subscription);
      composite.remove(subscription);

      expect(callback).not.toHaveBeenCalled();

      composite.unsubscribe();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("#clear", () => {
    it("should remove all the subsciptions from the set", () => {
      const callback1 = jest.fn();
      const subscription1 = new Subscription(callback1);
      const callback2 = jest.fn();
      const subscription2 = new Subscription(callback2);

      const composite = new CompositeSubscription();
      composite.add(subscription1);
      composite.add(subscription2);
      composite.clear();

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      composite.unsubscribe();
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe("#unsubscribe", () => {
    it("should unsubscribe all the subsciptions in the set", () => {
      const callback1 = jest.fn();
      const subscription1 = new Subscription(callback1);
      const callback2 = jest.fn();
      const subscription2 = new Subscription(callback2);

      const composite = new CompositeSubscription();
      composite.add(subscription1);
      composite.add(subscription2);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      composite.unsubscribe();
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      // ubsubscribing twice or more has no effect
      composite.unsubscribe();
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });
});
