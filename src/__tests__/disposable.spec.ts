import { Disposable, CompositeDisposable } from "../disposable";

describe("Disposable", () => {
  describe("dispose", () => {
    it("should call the function which is attached at the creation", () => {
      let x = 0;
      const disposable = new Disposable(() => {
        x += 1;
      });
      expect(x).toBe(0);
      disposable.dispose();
      expect(x).toBe(1);
      disposable.dispose();
      expect(x).toBe(1);
    });
  });
});

describe("CompositeDisposable", () => {
  describe("add", () => {
    it("should add a disposable to the set of disposables which are diposed at a time", () => {
      let x = 0;
      const disposable = new Disposable(() => {
        x += 1;
      });
      const composite = new CompositeDisposable();
      composite.add(disposable);
      expect(x).toBe(0);
      composite.dispose();
      expect(x).toBe(1);
      composite.dispose();
      expect(x).toBe(1);
    });
  });

  describe("remove", () => {
    it("should remove a disposable from the set", () => {
      let x = 0;
      const disposable = new Disposable(() => {
        x += 1;
      });
      const composite = new CompositeDisposable();
      composite.add(disposable);
      composite.remove(disposable);
      expect(x).toBe(0);
      composite.dispose();
      expect(x).toBe(0);
    });
  });

  describe("clear", () => {
    it("should remove all the disposables from the set", () => {
      let x1 = 0;
      const disposable1 = new Disposable(() => {
        x1 += 1;
      });
      let x2 = 0;
      const disposable2 = new Disposable(() => {
        x2 += 1;
      });
      const composite = new CompositeDisposable();
      composite.add(disposable1);
      composite.add(disposable2);
      composite.clear();
      expect(x1).toBe(0);
      expect(x2).toBe(0);
      composite.dispose();
      expect(x1).toBe(0);
      expect(x2).toBe(0);
    });
  });

  describe("dispose", () => {
    it("should dispose all the disposables in the set", () => {
      let x1 = 0;
      const disposable1 = new Disposable(() => {
        x1 += 1;
      });
      let x2 = 0;
      const disposable2 = new Disposable(() => {
        x2 += 1;
      });
      const composite = new CompositeDisposable();
      composite.add(disposable1);
      composite.add(disposable2);
      expect(x1).toBe(0);
      expect(x2).toBe(0);
      composite.dispose();
      expect(x1).toBe(1);
      expect(x2).toBe(1);
      composite.dispose();
      expect(x1).toBe(1);
      expect(x2).toBe(1);
    });
  });
});
