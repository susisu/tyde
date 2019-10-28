export interface IDisposable {
  /**
   * Disposes some resources attached to this object.
   */
  dispose(): void;
}

export class Disposable implements IDisposable {
  private disposed: boolean;
  private onDispose: (() => void) | undefined;

  /**
   * @param onDispose A callback function invoked when this object is disposed.
   */
  constructor(onDispose: () => void) {
    this.disposed = false;
    this.onDispose = onDispose;
  }

  /**
   * Invokes `onDispose` callback function to dispose resources.
   */
  dispose(): void {
    if (this.disposed || typeof this.onDispose !== "function") {
      return;
    }
    this.disposed = true;
    this.onDispose.call(undefined);
    this.onDispose = undefined;
  }
}

export class CompositeDisposable implements IDisposable {
  private disposed: boolean;
  private disposables: Set<IDisposable>;

  constructor() {
    this.disposed = false;
    this.disposables = new Set();
  }

  /**
   * Adds a disposable to the set of disposables which are disposed at a time when this object is
   * disposed.
   * @param disposable A disposable object.
   */
  add(disposable: IDisposable): void{
    if (this.disposed) {
      return;
    }
    this.disposables.add(disposable);
  }

  /**
   * Removes a disposable from the set of disposables.
   * @param disposable A disposable object.
   */
  remove(disposable: IDisposable): void {
    if (this.disposed) {
      return;
    }
    this.disposables.delete(disposable);
  }

  /**
   * Clears the set of disposables.
   */
  clear(): void {
    if (this.disposed) {
      return;
    }
    this.disposables.clear();
  }

  /**
   * Disposes all the disposables in the set.
   */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables.clear();
  }
}
