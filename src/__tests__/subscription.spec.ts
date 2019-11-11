import { Subscription, CompositeSubscription } from "../subscription";

describe("Subscription", () => {
  describe("unsubscribe", () => {
    it("should call the function which is attached at the creation", () => {
      let x = 0;
      const subsciption = new Subscription(() => {
        x += 1;
      });
      expect(x).toBe(0);
      subsciption.unsubscribe();
      expect(x).toBe(1);
      subsciption.unsubscribe();
      expect(x).toBe(1);
    });
  });
});

describe("CompositeSubscription", () => {
  describe("add", () => {
    it("should add a subscription to the set of subscriptions", () => {
      let x = 0;
      const subscription = new Subscription(() => {
        x += 1;
      });
      const composite = new CompositeSubscription();
      composite.add(subscription);
      expect(x).toBe(0);
      composite.unsubscribe();
      expect(x).toBe(1);
      composite.unsubscribe();
      expect(x).toBe(1);
    });
  });

  describe("remove", () => {
    it("should remove a subscription from the set", () => {
      let x = 0;
      const subscription = new Subscription(() => {
        x += 1;
      });
      const composite = new CompositeSubscription();
      composite.add(subscription);
      composite.remove(subscription);
      expect(x).toBe(0);
      composite.unsubscribe();
      expect(x).toBe(0);
    });
  });

  describe("clear", () => {
    it("should remove all the subsciptions from the set", () => {
      let x1 = 0;
      const subscription1 = new Subscription(() => {
        x1 += 1;
      });
      let x2 = 0;
      const subscription2 = new Subscription(() => {
        x2 += 1;
      });
      const composite = new CompositeSubscription();
      composite.add(subscription1);
      composite.add(subscription2);
      composite.clear();
      expect(x1).toBe(0);
      expect(x2).toBe(0);
      composite.unsubscribe();
      expect(x1).toBe(0);
      expect(x2).toBe(0);
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe all the subsciptions in the set", () => {
      let x1 = 0;
      const subscription1 = new Subscription(() => {
        x1 += 1;
      });
      let x2 = 0;
      const subscription2 = new Subscription(() => {
        x2 += 1;
      });
      const composite = new CompositeSubscription();
      composite.add(subscription1);
      composite.add(subscription2);
      expect(x1).toBe(0);
      expect(x2).toBe(0);
      composite.unsubscribe();
      expect(x1).toBe(1);
      expect(x2).toBe(1);
      composite.unsubscribe();
      expect(x1).toBe(1);
      expect(x2).toBe(1);
    });
  });
});
