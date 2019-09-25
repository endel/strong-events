type FunctionParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any
    ? P
    : never;

export class EventEmitter<CallbackSignature extends (...args: any[]) => any> {
  handlers: Array<CallbackSignature> = [];

  register(cb: CallbackSignature, once: boolean = false) {
    this.handlers.push(cb);
    return this;
  }

  invoke(...args: FunctionParameters<CallbackSignature>) {
    this.handlers.forEach((handler) => handler(...args));
  }

  invokeAsync(...args: FunctionParameters<CallbackSignature>) {
    return Promise.all(this.handlers.map((handler) => handler(...args)));
  }

  remove (cb: CallbackSignature) {
    const index = this.handlers.indexOf(cb);
    this.handlers[index] = this.handlers[this.handlers.length - 1];
    this.handlers.pop();
  }

  clear() {
    this.handlers = [];
  }
}

export function createSignal<CallbackSignature extends (...args: any[]) => void | Promise<any>>() {
  const emitter = new EventEmitter<CallbackSignature>();

  function register(this: any, cb: CallbackSignature): EventEmitter<CallbackSignature> {
    return emitter.register(cb, this === null);
  };

  register.once = (cb: CallbackSignature) => {
    const callback: any = function (...args: any[]) {
      cb(...args);
      emitter.remove(callback);
    }
    emitter.register(callback);
  }
  register.remove = (cb: CallbackSignature) => emitter.remove(cb)
  register.invoke = (...args: FunctionParameters<CallbackSignature>) => emitter.invoke(...args);
  register.invokeAsync = (...args: FunctionParameters<CallbackSignature>) => emitter.invokeAsync(...args);
  register.clear = () => emitter.clear();

  return register;
}
