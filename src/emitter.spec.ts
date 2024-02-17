import { vi, describe, it, expect } from "vitest";
import { Emitter } from "./emitter";

type EventTypes = {
  str: string;
  num: number;
};

describe("Emitter", () => {
  describe("#on", () => {
    it("should attach a handler function", () => {
      const emitter = new Emitter<EventTypes>();

      const handler = vi.fn(() => {});
      emitter.on("str", handler);

      emitter.emitSync("str", "foo");
      expect(handler).toHaveBeenNthCalledWith(1, "foo");

      emitter.emitSync("str", "bar");
      expect(handler).toHaveBeenNthCalledWith(2, "bar");
    });

    it("should return a subscription which will remove the handler when unsubscribed", () => {
      const emitter = new Emitter<EventTypes>();

      const handler = vi.fn(() => {});
      emitter.on("str", handler);
      const subscription = emitter.on("str", handler);

      emitter.emitSync("str", "foo");
      expect(handler).toHaveBeenNthCalledWith(1, "foo");

      subscription.unsubscribe();
      emitter.emitSync("str", "bar");
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should also provide a curried version", () => {
      const emitter = new Emitter<EventTypes>();
      const onStr = emitter.on("str");

      const handler = vi.fn(() => {});
      const subscription = onStr(handler);

      emitter.emitSync("str", "foo");
      expect(handler).toHaveBeenNthCalledWith(1, "foo");

      emitter.emitSync("str", "bar");
      expect(handler).toHaveBeenNthCalledWith(2, "bar");

      subscription.unsubscribe();
      emitter.emitSync("str", "baz");
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("#off", () => {
    it("should remove a handler function", () => {
      const emitter = new Emitter<EventTypes>();

      const handler = vi.fn(() => {});
      emitter.on("str", handler);

      emitter.emitSync("str", "foo");
      expect(handler).toHaveBeenNthCalledWith(1, "foo");

      emitter.off("str", handler);
      emitter.emitSync("str", "bar");
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("#emitSync", () => {
    it("should synchronously invoke handler functions attached to a key", () => {
      const emitter = new Emitter<EventTypes>();

      const handler1 = vi.fn(() => {});
      const handler2 = vi.fn(() => {});
      emitter.on("str", handler1);
      emitter.on("str", handler2);

      emitter.emitSync("str", "foo");
      expect(handler1).toHaveBeenNthCalledWith(1, "foo");
      expect(handler2).toHaveBeenNthCalledWith(1, "foo");
    });
  });

  describe("#emit", () => {
    it("should asynchronously invoke handler functions attached to a key", async () => {
      const emitter = new Emitter<EventTypes>();

      const handler1 = vi.fn(() => {});
      const handler2 = vi.fn(() => {});
      emitter.on("str", handler1);
      emitter.on("str", handler2);

      const promise = emitter.emit("str", "foo");
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();

      await promise;
      expect(handler1).toHaveBeenNthCalledWith(1, "foo");
      expect(handler2).toHaveBeenNthCalledWith(1, "foo");
    });
  });
});
