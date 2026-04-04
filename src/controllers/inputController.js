(function () {
  function createInputController(target) {
    const keys = new Set();
    const pressed = new Set();

    const onKeyDown = (event) => {
      if (!keys.has(event.code)) {
        pressed.add(event.code);
      }
      keys.add(event.code);
    };

    const onKeyUp = (event) => {
      keys.delete(event.code);
      pressed.delete(event.code);
    };

    target.addEventListener("keydown", onKeyDown);
    target.addEventListener("keyup", onKeyUp);

    return {
      keys,
      isPressed(code) {
        return keys.has(code);
      },
      wasPressed(code) {
        return pressed.has(code);
      },
      consumePressed(code) {
        const hadCode = pressed.has(code);
        pressed.delete(code);
        return hadCode;
      },
      clearPressed() {
        pressed.clear();
      },
      dispose() {
        target.removeEventListener("keydown", onKeyDown);
        target.removeEventListener("keyup", onKeyUp);
      },
    };
  }

  window.InputController = {
    createInputController,
  };
})();
