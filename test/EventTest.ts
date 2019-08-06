import { createSignal } from "../src";

describe("strong-events", () => {
  it("should declare callback", () => {
    const onCallback = createSignal<(arg0: string) => void>();

    onCallback(function(value) {
      console.log("onCallback:", value);
    });

    onCallback.once(function(value){
      console.log("onCallback (once): ", value);
    });

    onCallback.invoke("hey");
    onCallback.invoke("hey again");
  });

  it("should allow to remove a callback", () => {
    var cb = function() { console.log("callback!"); };

    const onSignal = createSignal();
    onSignal(cb);

    onSignal.invoke();

    onSignal.remove(cb);
    onSignal.invoke();
  });

  it("declare different callback types", () => {
    const onNumber = createSignal<(num: number) => void>();
    onNumber(function(num) { });

    const onTwoArgs = createSignal<(str: string, num: number) => void>();
    onTwoArgs(function(str, num) {
      // you get correct "string" auto-completion for "str"
    });

  })

});
