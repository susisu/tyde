import { Emitter } from "../emitter";

type Keys = "str" | "num";
type VT = {
  "str": string,
  "num": number,
};

describe("Emitter", () => {
  describe("on", () => {
    it("should attach a handler function", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const handler = (str: string): void => {
        x = str;
      };
      emitter.on("str", handler);
      emitter.emitSync("str", "foo");
      expect(x).toBe("foo");
      emitter.emitSync("str", "bar");
      expect(x).toBe("bar");
    });

    it("should return a subscription which will remove the handler when unsubscribed", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const handler = (str: string): void => {
        x = str;
      };
      const subscription = emitter.on("str", handler);
      emitter.emitSync("str", "foo");
      expect(x).toBe("foo");
      subscription.unsubscribe();
      emitter.emitSync("str", "bar");
      expect(x).toBe("foo");
    });

    it("should also provide a curried version", () => {
      const emitter = new Emitter<Keys, VT>();
      const onStr = emitter.on("str");
      let x: string | undefined = undefined;
      const handler = (str: string): void => {
        x = str;
      };
      const subscription = onStr(handler);
      emitter.emitSync("str", "foo");
      expect(x).toBe("foo");
      emitter.emitSync("str", "bar");
      expect(x).toBe("bar");
      subscription.unsubscribe();
      emitter.emitSync("str", "baz");
      expect(x).toBe("bar");
    });
  });

  describe("off", () => {
    it("should remove a handler function", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const handler = (str: string): void => {
        x = str;
      };
      emitter.on("str", handler);
      emitter.emitSync("str", "foo");
      expect(x).toBe("foo");
      emitter.off("str", handler);
      emitter.emitSync("str", "bar");
      expect(x).toBe("foo");
    });
  });

  describe("emitSync", () => {
    it("should synchronously invoke handler functions attached to a key", () => {
      const emitter = new Emitter<Keys, VT>();
      let x1: string | undefined = undefined;
      const handler1 = (str: string): void => {
        x1 = str;
      };
      let x2: string | undefined = undefined;
      const handler2 = (str: string): void => {
        x2 = str;
      };
      emitter.on("str", handler1);
      emitter.on("str", handler2);
      emitter.emitSync("str", "foo");
      expect(x1).toBe("foo");
      expect(x2).toBe("foo");
    });
  });

  describe("emit", () => {
    it("should asynchronously invoke handler functions attached to a key", async () => {
      const emitter = new Emitter<Keys, VT>();
      let x1: string | undefined = undefined;
      const handler1 = (str: string): void => {
        x1 = str;
      };
      let x2: string | undefined = undefined;
      const handler2 = (str: string): void => {
        x2 = str;
      };
      emitter.on("str", handler1);
      emitter.on("str", handler2);
      const promise = emitter.emit("str", "foo");
      expect(x1).toBe(undefined);
      expect(x2).toBe(undefined);
      await promise;
      expect(x1).toBe("foo");
      expect(x2).toBe("foo");
    });
  });
});
