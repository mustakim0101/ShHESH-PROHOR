(function () {
  function createInputController(target) {
    const keys = new Set();

    const onKeyDown = (event) => {
      keys.add(event.code);
    };

    const onKeyUp = (event) => {
      keys.delete(event.code);
    };

    target.addEventListener("keydown", onKeyDown);
    target.addEventListener("keyup", onKeyUp);

    return {
      keys,
      isPressed(code) {
        return keys.has(code);
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
