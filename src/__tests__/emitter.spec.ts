import { Emitter } from "../emitter";

type Keys = "str" | "num";
type VT = {
  "str": string,
  "num": number,
};

describe("Emitter", () => {
  describe("on", () => {
    it("should attach a listener function", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const listener = (str: string): void => {
        x = str;
      };
      emitter.on("str", listener);
      emitter.emit("str", "foo");
      expect(x).toBe("foo");
    });

    it("should return a disposable which will remove the listener function when disposed", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const listener = (str: string): void => {
        x = str;
      };
      const disposable = emitter.on("str", listener);
      disposable.dispose();
      emitter.emit("str", "foo");
      expect(x).toBe(undefined);
    });
  });

  describe("off", () => {
    it("should remove a listener function", () => {
      const emitter = new Emitter<Keys, VT>();
      let x: string | undefined = undefined;
      const listener = (str: string): void => {
        x = str;
      };
      emitter.on("str", listener);
      emitter.off("str", listener);
      emitter.emit("str", "foo");
      expect(x).toBe(undefined);
    });
  });

  describe("emit", () => {
    it("should invoke listener functions attached to a key", () => {
      const emitter = new Emitter<Keys, VT>();
      let x1: string | undefined = undefined;
      const listener1 = (str: string): void => {
        x1 = str;
      };
      let x2: string | undefined = undefined;
      const listener2 = (str: string): void => {
        x2 = str;
      };
      emitter.on("str", listener1);
      emitter.on("str", listener2);
      emitter.emit("str", "foo");
      expect(x1).toBe("foo");
      expect(x2).toBe("foo");
    });
  });

  describe("emitAsync", () => {
    it("should invoke listener functions attached to a key asynchronously", async () => {
      const emitter = new Emitter<Keys, VT>();
      let x1: string | undefined = undefined;
      const listener1 = (str: string): void => {
        x1 = str;
      };
      let x2: string | undefined = undefined;
      const listener2 = (str: string): void => {
        x2 = str;
      };
      emitter.on("str", listener1);
      emitter.on("str", listener2);
      const promise = emitter.emitAsync("str", "foo");
      expect(x1).toBe(undefined);
      expect(x2).toBe(undefined);
      await promise;
      expect(x1).toBe("foo");
      expect(x2).toBe("foo");
    });
  });
});
